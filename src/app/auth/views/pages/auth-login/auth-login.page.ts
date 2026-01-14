import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "../../../../shared/services/notification.service";
import { BaseValidator } from "../../../../shared/validators/base.validator";
import { EmailValidator } from "../../../../shared/validators/email.validator";
import { PhoneValidator } from "../../../../shared/validators/phone.validator";
import { FormStateEnum } from "../../../../shared/views/base-form.view";
import { BasePageFormView } from "../../../../shared/views/base-page-form.view";
import { InputTextComponent } from "../../../../shared/views/components/atoms/input-text/input-text.component";
import { LogInFormDto } from "../../../models/form/log-in.form.dto";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: "auth-login-page",
    templateUrl: "./auth-login.page.html",
    styles: ``,
})
export class AuthLoginPage extends BasePageFormView {
    @ViewChild("inputPassword") inputPasswordComponent: InputTextComponent;

    form = {
        fields: {
            username: {
                value: "",
                mask: null,
                failedValidations: {
                    required: false,
                    email: false,
                    phone: false,
                },
                isValid: (): boolean =>
                    !this.form.fields.username.failedValidations.required &&
                    !this.form.fields.username.failedValidations.phone &&
                    !this.form.fields.username.failedValidations.email,

                validate: (): boolean => {
                    this.form.fields.username.failedValidations.required = false;
                    this.form.fields.username.failedValidations.phone = false;
                    this.form.fields.username.failedValidations.email = false;
                    if (!this.form.fields.username.value) {
                        this.form.fields.username.failedValidations.required = true;
                    } else if (!this.form.fields.username.mask && !new EmailValidator().isValid(this.form.fields.username.value)) {
                        this.form.fields.username.failedValidations.email = true;
                    } else if (this.form.fields.username.mask && !new PhoneValidator().isValid(this.form.fields.username.value)) {
                        this.form.fields.username.failedValidations.phone = true;
                    }
                    return this.form.fields.username.isValid();
                },
            },
        },
    };

    constructor(
        private readonly authService: AuthService,
        private readonly notifier: NotificationService,
        private readonly spinner: NgxSpinnerService,
        private readonly router: Router
    ) {
        super();
    }

    override onSubmit(): void {
        if (this.isFormValid()) {
            this.spinner.show();
            this.formState = FormStateEnum.SUBMITION_LOADING;
            const dto = this.extractDtoFromForm();

            this.authService.logIn(dto).subscribe({
                next: (response) => {
                    this.formState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
                    this.notifier.showSuccess("Login realizado com sucesso!");
                    this.authService.storeTokenInSession(response.accessToken, response.refreshToken);
                    this.authService.redirectToApp();
                },
                error: (e) => {
                    this.formState = FormStateEnum.SUBMITION_FAILED;
                    this.spinner.hide();
                    throw e;
                },
            });
        } else {
            this.formState = FormStateEnum.SUBMITION_FAILED;
            this.notifier.showError(this.ERROR_MESSAGES.FORM_HAS_ERRORS("do login"));
        }
    }
    override isFormValid(): boolean {
        let isValid = true;
        isValid = this.form.fields.username.validate() && isValid;
        isValid = this.inputPasswordComponent.validate() && isValid;
        return isValid;
    }

    onChangeUsername() {
        const firstChar = this.form.fields.username.value.removeFormat().charAt(0);
        if (/\d/.test(firstChar)) {
            this.form.fields.username.mask = BaseValidator.MASKS.PHONE;
        } else {
            this.form.fields.username.mask = null;
            this.form.fields.username.value = this.form.fields.username.value.toLocaleLowerCase().trim();
        }
        this.form.fields.username.validate();
    }

    private extractDtoFromForm(): LogInFormDto {
        return {
            username: this.form.fields.username.value,
            password: this.inputPasswordComponent.getValue(),
        };
    }
}
