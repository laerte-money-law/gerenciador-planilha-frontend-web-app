import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { PageRoute } from "../../../../shared/models/page-route";
import { NotificationService } from "../../../../shared/services/notification.service";
import { PageService } from "../../../../shared/services/page.service";
import { Constants } from "../../../../shared/utils/constants";
import { KeyGenerator } from "../../../../shared/utils/key-generator";
import { BaseValidator } from "../../../../shared/validators/base.validator";
import { EmailValidator } from "../../../../shared/validators/email.validator";
import { FormStateEnum } from "../../../../shared/views/base-form.view";
import { BaseAppPageFormView } from "../../../../shared/views/base-app-page-form.view";
import {
    LowerCaseInputTextModifier,
    NameInputTextModifier,
} from "../../../../shared/views/components/atoms/input-text/input-text-modifiers";
import { InputTextComponent } from "../../../../shared/views/components/atoms/input-text/input-text.component";
import { ConsultantDto } from "../../../models/consultant.dto";
import { AdminConsultantSaveFormDto } from "../../../models/forms/admin-consultant-save.form.dto";
import { AdminConsultantService } from "../../../services/admin-consultant.service";

@Component({
    selector: "admin-consultant-save-page",
    templateUrl: "./admin-consultant-save.page.html",
    styles: ``,
})
export class AdminConsultantSavePage extends BaseAppPageFormView implements OnInit {
    @ViewChild("inputName") inputName: InputTextComponent;
    @ViewChild("inputPhone") inputPhone: InputTextComponent;
    @ViewChild("inputEmail") inputEmail: InputTextComponent;

    editRecord: ConsultantDto;
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
            new PageRoute(this.URLS.PATHS.ADMIN.CONSULTANT.ROOT(), "Consultores", "Consultores"),
            new PageRoute(this.URLS.PATHS.ADMIN.CONSULTANT.CREATE(), "Cadastrar consultor", "Cadastrar"),
        ];
    }

    constructor(
        private readonly pageService: PageService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly spinner: NgxSpinnerService,
        private readonly notifier: NotificationService,
        private readonly adminConsultantService: AdminConsultantService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadRecordInFormIfEditing();
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

    protected override onSubmit(): void {
        if (this.isFormValid()) {
            this.formState = FormStateEnum.SUBMITION_LOADING;

            const dto = this.extractDtoFromForm();

            this.spinner.show();
            this.adminConsultantService.saveConsultant(dto, this.editRecord?.code).subscribe({
                next: (response) => {
                    this.formState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
                    this.notifier.showSuccess("Consultor salvo com sucesso!");
                    this.router.navigate([this.URLS.PATHS.ADMIN.CONSULTANT.ROOT()]);
                    this.spinner.hide();
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

    protected override isFormValid(): boolean {
        let isValid = true;
        isValid = this.inputName.validate() && isValid;
        isValid = this.inputPhone.validate() && isValid;
        isValid = this.inputEmail.validate() && isValid;
        isValid = this.isPasswordInEditMode ? this.form.fields.password.validate() && isValid : true;
        return isValid;
    }

    private extractDtoFromForm(): AdminConsultantSaveFormDto {
        return {
            name: this.inputName.getValue(),
            phone: this.inputPhone.getValue(),
            email: this.inputEmail.getValue(),
            password: this.isPasswordInEditMode ? this.form.fields.password.value : null,
        };
    }

    private loadRecordInFormIfEditing(): void {
        this.spinner.show();
        setTimeout(() => {
            this.route.params.subscribe((params) => {
                const code = params["code"];
                if (code) {
                    this.isPasswordInEditMode = false;
                    this.findConsultantByCode(code);
                } else {
                    this.spinner.hide();
                    this.onGeneratePassword();
                }
            });
        }, Constants.DEFAULT_APP_TIMEOUT);
    }

    private findConsultantByCode(code: string): void {
        this.adminConsultantService.findByCode(code).subscribe({
            next: (response) => {
                this.editRecord = response;
                this.fillFormWithEditRecord();
                this.spinner.hide();
            },
            error: (e) => {
                this.router.navigate([this.URLS.PATHS.ADMIN.CONSULTANT.ROOT()]);
                throw e;
            },
        });
    }

    private fillFormWithEditRecord() {
        this.inputName.changeValue(this.editRecord.name);
        this.inputPhone.changeValue(this.formatPhone(this.editRecord.phone));
        this.inputEmail.changeValue(this.editRecord.email);
    }
}
