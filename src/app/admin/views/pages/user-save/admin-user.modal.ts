import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UsersService } from "src/app/admin/services/users.service";
import { TeamService } from "src/app/admin/services/team.service";
import { UserResponseDto } from "src/app/admin/models/user.dto";
import { SelectOption } from "src/app/shared/views/components/atoms/select-single-choice/select-single-choice.component";
import { KeyGenerator } from "src/app/shared/utils/key-generator";

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

  roles: SelectOption[] = [
    { text: "Administrador", value: "ADMIN" },
    { text: "Usuário", value: "USER" }
  ];

  isPasswordInEditMode = true;

  form = {
    name: "",
    email: "",
    teamId: "",
    role: "USER" as "ADMIN" | "USER",

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
  private modalService: NgbModal
) {}

  ngOnInit(): void {

    this.loadTeams();

    if (this.user) {

      this.isEditMode = true;

      this.form.name = this.user.name;
      this.form.email = this.user.email;
      this.form.teamId = String(this.user.team?.id);
      this.form.role = this.user.role as "ADMIN" | "USER";

      this.isPasswordInEditMode = false;

    }

  }

  loadTeams(): void {

    this.teamService.findAllTeams().subscribe(teams => {

      this.teams = teams.map(t => ({
        text: t.name,
        value: String(t.id)
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
      role: this.form.role

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
      role: this.form.role

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

  this.teamService.createTeam(this.newTeamName)
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