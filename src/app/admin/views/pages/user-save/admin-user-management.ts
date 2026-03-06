import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { BaseAppPageFormView } from "../../../../shared/views/base-app-page-form.view";
import { NgxSpinnerService } from "ngx-spinner";

import { PageRoute } from "../../../../shared/models/page-route";
import { PageService } from "../../../../shared/services/page.service";
import { NotificationService } from "../../../../shared/services/notification.service";

import { FormStateEnum } from "../../../../shared/views/base-form.view";

import { InputTextComponent } from "../../../../shared/views/components/atoms/input-text/input-text.component";

import { Pagination } from "src/app/shared/utils/pagination";

import { UsersService } from "src/app/admin/services/users.service";
import { TeamService } from "src/app/admin/services/team.service";

import { UserResponseDto } from "src/app/admin/models/user.dto";

import { CreateUserRequestDto } from "src/app/admin/models/create-user-request.dto";

import { KeyGenerator } from "src/app/shared/utils/key-generator";
import { NameInputTextModifier, LowerCaseInputTextModifier } from "src/app/shared/views/components/atoms/input-text/input-text-modifiers";
import { EmailValidator } from "src/app/shared/validators/email.validator";
import { SelectOption, SelectSingleChoiceComponent } from "src/app/shared/views/components/atoms/select-single-choice/select-single-choice.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TemplateRef } from "@angular/core";

@Component({
    selector: "admin-user-management-page",
    templateUrl: "./admin-user-management.html",
})
export class AdminUsersManagementPage
    extends BaseAppPageFormView
    implements OnInit {

    @ViewChild("inputName") inputName: InputTextComponent
    @ViewChild("inputEmail") inputEmail: InputTextComponent

    @ViewChild("selectTeam") selectTeam: SelectSingleChoiceComponent
    @ViewChild("selectRole") selectRole: SelectSingleChoiceComponent

    @ViewChild("deleteSwal") deleteSwal;
    @ViewChild("createTeamModal") createTeamModal!: TemplateRef<any>;    newTeamName: string = "";
    teams: SelectOption[] = []

    roles: SelectOption[] = [
        { text: "Administrador", value: "ADMIN" },
        { text: "Usuário", value: "USER" }
    ]

    allRecords: UserResponseDto[] = []

    filteredList: UserResponseDto[] = []

    pagination: Pagination<UserResponseDto> = new Pagination([])

    isPasswordInEditMode = true
    selectClientUser: UserResponseDto | null = null

    form = {
    fields: {
        password: {
            value: "",
            failedValidations: {
                required: false,
            },
            isValid: (): boolean => !this.form.fields.password.failedValidations.required,
            validate: (): boolean => {
                this.form.fields.password.failedValidations.required = false;
                if (!this.form.fields.password.value) {
                    this.form.fields.password.failedValidations.required = true;
                }
                return this.form.fields.password.isValid();
            },
        },
    },
    };

    nameInputTextModifier = new NameInputTextModifier();
    emailInputTextValidator = new EmailValidator();
    lowerCaseInputTextModifier = new LowerCaseInputTextModifier();

    constructor(
    private readonly pageService: PageService,
    private readonly spinner: NgxSpinnerService,
    private readonly notifier: NotificationService,
    private readonly usersService: UsersService,
    private readonly teamService: TeamService,
    private readonly modalService: NgbModal

    ) {
    super()
    }

    ngOnInit(): void {

    this.pageService.setToolbar(this.getBreadcrumbs())

    this.loadTeams()

    this.loadRecords()
    }

    override getBreadcrumbs(): PageRoute[] {

    return [
        new PageRoute("/admin/client", "Clientes", "Clientes"),
        new PageRoute("/admin/client/users", "Usuários", "Usuários"),
    ]
    }

    private loadTeams(): void {

    this.teamService.findAllTeams().subscribe({

        next: (teams) => {

            this.teams = teams.map(team => ({
                text: team.name,
                value: String(team.id)
            }))
        },

        error: (e) => { throw e }
        })
    }

    private loadRecords(): void {

        this.spinner.show()

        this.usersService.findAllUsers().subscribe({

        next: (response) => {

        this.allRecords = response.data

        this.filteredList = this.allRecords

        this.refreshPagination()

        this.spinner.hide()
        },

        error: (e) => {

        this.spinner.hide()

        throw e
        }
        })
    }

    override onSubmit(): void {

        if (!this.isFormValid()) {

            this.formState = FormStateEnum.SUBMITION_FAILED
            this.notifier.showError("Formulário inválido")

            return
        }

        this.spinner.show()

        const dto: CreateUserRequestDto = {
            name: this.inputName.getValue(),
            email: this.inputEmail.getValue(),
            password: this.form.fields.password.value,
            team_id: Number(this.selectTeam.getSelectedValue()),
            role: this.selectRole.getSelectedValue() as "ADMIN" | "USER"
        };

        this.usersService.createUser(dto).subscribe({
            next: () => {
                this.spinner.hide()
                this.notifier.showSuccess("Usuário criado com sucesso")
                this.resetForm()
                this.loadRecords()
            },

            error: (e) => {
                this.spinner.hide()
                this.formState = FormStateEnum.SUBMITION_FAILED
                throw e
            }
        })
    }

    override isFormValid(): boolean {
        let isValid = true
        isValid = this.inputName.validate() && isValid
        isValid = this.inputEmail.validate() && isValid
        isValid = this.selectTeam.validate() && isValid
        isValid = this.selectRole.validate() && isValid
        isValid = this.form.fields.password.validate() && isValid
        return isValid
    }

    onGeneratePassword(): void {
        this.form.fields.password.value =
        KeyGenerator.generateCryptoBasedPassword()
    }

    private refreshPagination(): void {
        this.pagination = new Pagination(this.filteredList)
    }

    private resetForm(): void {
        this.inputName.reset()
        this.inputEmail.reset()
        this.selectTeam.setValue("")
        this.selectRole.setValue("")
        this.form.fields.password.value = ""
        this.formState = FormStateEnum.INITIAL
    }

    onDeleteClientUser(userId: number): void {
        this.selectClientUser = this.allRecords.find(u => u.id === userId)
        setTimeout(() => {
        this.deleteSwal.fire()
        })
    }

    onDeleteConfirmation(): void {
        if (!this.selectClientUser) return
        this.spinner.show()
        this.usersService.deleteUser(this.selectClientUser.id).subscribe({
        next: () => {
            this.spinner.hide()
            this.notifier.showSuccess("Usuário excluído com sucesso")
            this.loadRecords()
            },
        error: (e) => {
            this.spinner.hide()
            throw e
            }
        })
    }

    onChangePassword(): void {
        this.isPasswordInEditMode = true;
        this.onGeneratePassword();
    }

    createTeam(modal): void {
        if (!this.newTeamName?.trim()) {
        this.notifier.showError("Informe o nome do time");
        return;
    }

    this.spinner.show();
    this.teamService.createTeam(this.newTeamName).subscribe({
    next: (team) => {
        this.spinner.hide();
        this.teams.push({
            text: team.name,
            value: String(team.id)
        });

        this.selectTeam.setValue(String(team.id));
        modal.close();
        this.notifier.showSuccess("Time criado com sucesso");
    },
    error: () => {
            this.spinner.hide();
            this.notifier.showError("Erro ao criar time");
            }
        });
    }

    openCreateTeamModal(): void {
        this.newTeamName = "";
        this.modalService.open(this.createTeamModal, {
            centered: true
        });
    }
}