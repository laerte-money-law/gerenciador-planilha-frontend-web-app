import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "../../../../shared/services/notification.service";
import { FormStateEnum } from "../../../../shared/views/base-form.view";
import { BasePageFormView } from "../../../../shared/views/base-page-form.view";
import { InputTextComponent } from "../../../../shared/views/components/atoms/input-text/input-text.component";
import { AuthService } from "../../../services/auth.service";
import { AppUrls } from "../../../../app.urls";

@Component({
    selector: "auth-redefine-password-page",
    templateUrl: "./auth-redefine-password.page.html",
    styles: ``,
})
export class AuthRedefinePasswordPage extends BasePageFormView {
    @ViewChild("inputPassword") inputPasswordComponent: InputTextComponent;
    @ViewChild("inputConfirmPassword") inputConfirmPasswordComponent: InputTextComponent;

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
            const newPassword = this.inputPasswordComponent.getValue();

            this.authService.redefinePassword(newPassword).subscribe({
                next: () => {
                    this.formState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
                    this.spinner.hide();
                    this.notifier.showSuccess("Senha redefinida com sucesso! Faça login novamente para continuar.");
                    this.authService.logout();
                },
                error: (e) => {
                    this.formState = FormStateEnum.SUBMITION_FAILED;
                    this.spinner.hide();
                    throw e;
                },
            });
        } else {
            this.formState = FormStateEnum.SUBMITION_FAILED;
            this.notifier.showError(this.ERROR_MESSAGES.FORM_HAS_ERRORS("da redefinição de senha"));
        }
    }

    override isFormValid(): boolean {
        let isValid = true;
        isValid = this.inputPasswordComponent.validate() && isValid;
        isValid = this.inputConfirmPasswordComponent.validate() && isValid;
        
        const password = this.inputPasswordComponent.getValue();
        const confirmPassword = this.inputConfirmPasswordComponent.getValue();

        if (password !== confirmPassword) {
            this.notifier.showError("As senhas não coincidem.");
            isValid = false;
        }

        return isValid;
    }
}
