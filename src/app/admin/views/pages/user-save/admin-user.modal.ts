import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UsersService } from "src/app/admin/services/users.service";
import { TeamService } from "src/app/admin/services/team.service";
import { UserResponseDto } from "src/app/admin/models/user.dto";
import { SelectOption } from "src/app/shared/views/components/atoms/select-single-choice/select-single-choice.component";
import { KeyGenerator } from "src/app/shared/utils/key-generator";
import { AdminClientService } from "src/app/admin/services/admin-client.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { UserRoleEnum } from "src/app/auth/models/enum/user-role.enum";

@Component({
  selector: "admin-user-modal",
  templateUrl: "./admin-user.modal.html",
})
export class AdminUserModalComponent implements OnInit {

  @Input() user?: UserResponseDto;
  @ViewChild("createTeamModal")
    createTeamModal!: TemplateRef<any>;
  

  isEditMode = false;

  teams: SelectOption[] = [];
  clients: SelectOption[] = [];

  get isAdmin(): boolean {
    return this.authService.userInfo?.role === UserRoleEnum.ADMIN;
  }

  roles: SelectOption[] = [
    { text: "Administrador", value: "ADMIN" },
    { text: "Usuário", value: "USER" },
    { text: "Cliente", value: "CLIENT" }
  ];

  isPasswordInEditMode = true;

  form = {
    name: "",
    email: "",
    teamId: "",
    clientId: "",
    role: "USER" as "ADMIN" | "USER" | "CLIENT",

    fields: {
      password: {
        value: "",
        failedValidations: {
          required: false
        },

        isValid: () =>
          !this.form.fields.password.failedValidations.required,

        validate: () => {

          this.form.fields.password.failedValidations.required = false;

          if (!this.form.fields.password.value) {
            this.form.fields.password.failedValidations.required = true;
          }

          return this.form.fields.password.isValid();
        }
      }
    }
  };

  newTeamName = "";

  constructor(
  private modal: NgbActiveModal,
  private usersService: UsersService,
  private teamService: TeamService,
  private adminClientService: AdminClientService,
  private authService: AuthService,
  private modalService: NgbModal
) {}

  ngOnInit(): void {

    this.loadTeams();

    if (this.isAdmin) {
      this.loadClients();
    } else {
      this.loadTeams();
    }

    if (this.user) {

      this.isEditMode = true;

      this.form.name = this.user.name;
      this.form.email = this.user.email;
      this.form.teamId = String(this.user.team?.id);
      this.form.clientId = String(this.user.client?.id || "");
      this.form.role = this.user.role as "ADMIN" | "USER" | "CLIENT";

      if (this.isAdmin && this.form.clientId) {
        this.loadTeams(Number(this.form.clientId));
      }

      this.isPasswordInEditMode = false;

    }

  }

  loadTeams(clientId?: number): void {

    this.teamService.findAllTeams(clientId).subscribe(teams => {

      this.teams = teams.map(t => ({
        text: t.name,
        value: String(t.id)
      }));

    });

  }

  onClientChange(): void {
    this.form.teamId = "";
    this.teams = [];
    if (this.form.clientId) {
      this.loadTeams(Number(this.form.clientId));
    }
  }

  loadClients(): void {

    this.adminClientService.findAllClients().subscribe(clients => {

      this.clients = clients.map(c => ({
        text: c.companyName,
        value: String(c.id)
      }));

    });

  }

  save(): void {

    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }

  }

  createUser(): void {

    this.usersService.createUser({

      name: this.form.name,
      email: this.form.email,
      password: this.form.fields.password.value,
      team_id: Number(this.form.teamId),
      client_id: this.isAdmin && this.form.clientId ? Number(this.form.clientId) : null,
      role: this.isAdmin ? this.form.role : "USER"

    }).subscribe(() => {

      this.modal.close(true);

    });

  }

  updateUser(): void {

    if (!this.user) return;

    this.usersService.updateUser(this.user.id, {

      name: this.form.name,
      email: this.form.email,
      team_id: Number(this.form.teamId),
      client_id: this.isAdmin && this.form.clientId ? Number(this.form.clientId) : null,
      role: this.isAdmin ? this.form.role : "USER"

    }).subscribe(() => {

      this.modal.close(true);

    }); 

  }


  onGeneratePassword(): void {

    this.form.fields.password.value =
      KeyGenerator.generateCryptoBasedPassword();

  }

  onChangePassword(): void {

    this.isPasswordInEditMode = true;

    this.onGeneratePassword();

  }

  close(): void {
    this.modal.dismiss();
  }

  openCreateTeamModal(): void {

  this.newTeamName = "";

  this.modalService.open(this.createTeamModal, {
    centered: true
  });

}
  createTeam(modal): void {

    if (!this.newTeamName.trim()) return;

    this.teamService.createTeam(this.newTeamName, this.isAdmin ? Number(this.form.clientId) : undefined)
      .subscribe(team => {

        this.teams.push({
          text: team.name,
          value: String(team.id)
        });

        this.form.teamId = String(team.id);

        this.newTeamName = "";

        modal.close();

      });
  }

}