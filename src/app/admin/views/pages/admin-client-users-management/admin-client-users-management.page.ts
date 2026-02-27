import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseAppPageFormView } from "../../../../shared/views/base-app-page-form.view";
import { NgxSpinnerService } from "ngx-spinner";
import { PageRoute } from "../../../../shared/models/page-route";
import { PageService } from "../../../../shared/services/page.service";
import { Constants } from "../../../../shared/utils/constants";
import { KeyGenerator } from "../../../../shared/utils/key-generator";
import { NotificationService } from "../../../../shared/services/notification.service";
import { BaseValidator } from "../../../../shared/validators/base.validator";
import { EmailValidator } from "../../../../shared/validators/email.validator";
import { FormStateEnum } from "../../../../shared/views/base-form.view";
import {
    LowerCaseInputTextModifier,
    NameInputTextModifier,
} from "../../../../shared/views/components/atoms/input-text/input-text-modifiers";
import { InputTextComponent } from "../../../../shared/views/components/atoms/input-text/input-text.component";
import { AdminClientService } from "../../../services/admin-client.service";
import { ClientUserDto } from "src/app/admin/models/client-user.dto";
import { Pagination } from "src/app/shared/utils/pagination";
import * as _ from "lodash";
import { ClientDto } from "../../../models/client.dto";

@Component({
    selector: "admin-client-users-management-page",
    templateUrl: "./admin-client-users-management.page.html",
    styles: ``,
})
export class AdminClientUsersManagementPage extends BaseAppPageFormView {
    @ViewChild("inputName") inputName: InputTextComponent;
    @ViewChild("inputPhone") inputPhone: InputTextComponent;
    @ViewChild("inputEmail") inputEmail: InputTextComponent;
    @ViewChild("deleteSwal") deleteSwal;

    allRecords: ClientUserDto[] = [];
    filteredList: ClientUserDto[] = [];
    pagination: Pagination<ClientUserDto>;
    searchText = "";
    selectClientUser: ClientUserDto;

    clientCode: string;
    client: ClientDto;
    editRecord: ClientUserDto;
    isPasswordInEditMode = true;
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
    PHONE_MASK = BaseValidator.MASKS.PHONE;

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.ADMIN.CLIENT.ROOT(), "Clientes", "Clientes"),
            new PageRoute(this.URLS.PATHS.ADMIN.CLIENT.USERS_MANAGEMENT(), "Gerenciamento de usuários", "Usuários"),
        ];
    }

    constructor(
        private readonly pageService: PageService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly spinner: NgxSpinnerService,
        private readonly notifier: NotificationService,
        private readonly adminClientService: AdminClientService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadClient();
        this.loadRecords();
    }

    onGeneratePassword(): void {
        this.form.fields.password.value = KeyGenerator.generateCryptoBasedPassword();
        if (this.isFormInErrorState()) {
            this.form.fields.password.validate();
        }
    }

    onChangePassword(): void {
        this.isPasswordInEditMode = true;
        this.onGeneratePassword();
    }

    override onSubmit(): void {
        if (this.isFormValid()) {
            this.spinner.show();
            this.formState = FormStateEnum.SUBMITION_LOADING;
            this.adminClientService
                .saveUserClient(this.clientCode, {
                    code: this.editRecord?.code,
                    name: this.inputName.getValue(),
                    phone: this.inputPhone.getValue(),
                    email: this.inputEmail.getValue(),
                    password: this.form.fields.password.value,
                })
                .subscribe({
                    next: () => {
                        this.spinner.hide();
                        this.notifier.showSuccess("Usuário salvo com sucesso");
                        this.resetForm();
                        this.loadRecords();
                    },
                    error: (e) => {
                        this.formState = FormStateEnum.SUBMITION_FAILED;
                        this.spinner.hide();
                        throw e;
                    },
                });
        } else {
            this.formState = FormStateEnum.SUBMITION_FAILED;
            this.notifier.showError(this.ERROR_MESSAGES.FORM_HAS_ERRORS());
        }
    }

    override isFormValid(): boolean {
        let isValid = true;
        isValid = this.inputName.validate() && isValid;
        isValid = this.inputPhone.validate() && isValid;
        isValid = this.inputEmail.validate() && isValid;
        if (this.editRecord == null) {
            isValid = this.form.fields.password.validate() && isValid;
        }
        return isValid;
    }

    onSearchFilterChance(): void {
        const search = this.searchText.toLocaleLowerCase().trim();

        this.filteredList = this.allRecords.filter(
            (e) =>
                e.name?.toLowerCase().indexOf(search) >= 0 ||
                e.email?.toLowerCase().indexOf(search) >= 0 ||
                e.phone?.toLowerCase().indexOf(search) >= 0
        );
        this.refreshPagination();
    }

    onUpdateStatus(userCode: string): void {
        this.spinner.show();
        this.adminClientService.updateStatusClientUser(this.clientCode, userCode).subscribe({
            next: () => {
                this.loadRecords();
                this.spinner.hide();
                this.notifier.showSuccess("Status alterado com sucesso!");
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }

    onEdit(userCode: string): void {
        this.editRecord = this.allRecords.find((e) => e.code == userCode);
        this.loadRecordInFormIfEditing();
    }

    onDeleteClientUser(userCode: string): void {
        this.selectClientUser = this.allRecords.find((u) => u.code === userCode);
        setTimeout(() => {
            this.deleteSwal.fire();
        }, Constants.DEFAULT_APP_TIMEOUT);
    }

    onDeleteConfirmation(): void {
        this.spinner.show();
        this.adminClientService.deleteClientUser(this.clientCode, this.selectClientUser.code).subscribe({
            next: () => {
                this.loadRecords();
                this.notifier.showSuccess("Usuário excluido com sucesso!");
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }

    private resetForm() {
        this.inputName.reset();
        this.inputPhone.reset();
        this.inputEmail.reset();
        this.form.fields.password.value = "";
        this.editRecord = null;
        this.formState = FormStateEnum.INITIAL;
    }

    private loadRecords(): void {
        this.spinner.show();

        this.adminClientService.findAllClientUser(this.clientCode).subscribe({
            next: (response) => {
                this.allRecords = response;
                this.allRecords = _.orderBy(this.allRecords, ["status", "name"]);
                this.filteredList = this.allRecords;
                this.refreshPagination();

                this.spinner.hide();
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }

    private refreshPagination(): void {
        this.pagination = new Pagination(this.filteredList);
    }

    private loadRecordInFormIfEditing(): void {
        this.inputName.changeValue(this.editRecord.name);
        this.inputPhone.changeValue(this.formatPhone(this.editRecord.phone));
        this.inputEmail.changeValue(this.editRecord.email);
    }

    private loadClient() {
        this.route.params.subscribe((params) => {
            this.clientCode = params["code"];
            // const clientCode = params["code"];
            this.adminClientService.findByCode(this.clientCode).subscribe({
                next: (response) => {
                    this.client = response;
                },
                error: (e) => {
                    this.router.navigate([this.URLS.PATHS.ADMIN.CLIENT.ROOT()]);
                    throw e;
                },
            });
        });
    }
}
