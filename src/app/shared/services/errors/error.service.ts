import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { AuthService } from "../../../auth/services/auth.service";

@Injectable({
    providedIn: "root",
})
export class ErrorService {
    constructor(
        private readonly notifier: NotificationService,
        private readonly spinner: NgxSpinnerService,
        private readonly router: Router,
        private readonly authService: AuthService
    ) {}

    showNotificationMessage(error: HttpErrorResponse): void {
        let hideSpinner = true;
        switch (true) {
            case error.status == 0:
                this.notifier.showError(
                    "Não foi possível se conectar com o servidor. Verifique se você está conectado à internet ou entre em contato com nosso suporte.",
                    null,
                    15000
                );
                break;
            case error.status == HttpStatusCode.ServiceUnavailable:
                this.notifier.showError(
                    "Um dos nossos serviços está fora do ar. Por favor, entre em contato com nosso suporte.",
                    null,
                    15000
                );
                break;
            case error.status == HttpStatusCode.InternalServerError || error.status == HttpStatusCode.MisdirectedRequest:
                this.notifier.showError(
                    "Ocorreu um erro inesperado no servidor. Mas não se preocupe, o erro já foi registrado e será corrigido em breve pela nossa equipe.",
                    null,
                    15000
                );
                break;
            case error.status == HttpStatusCode.NotImplemented:
                this.notifier.showError(
                    "A funcionalidade que você está buscando ainda não está disponível no momento. Por favor, tente novamente mais tarde ou entre em contato com nosso suporte.",
                    null,
                    15000
                );
                break;
            case error.status == HttpStatusCode.BadRequest:
                let errorMsg =
                    "Ocorreu um erro durante o envio das informações para o servidor. Por favor, entre em contato com nosso suporte.";
                // if (Array.isArray(error.error.message) && error.error.message.length) {
                //     errorMsg = error.error.message[0].substr(error.error.message[0].indexOf(".") + 1);
                // }
                this.notifier.showError(errorMsg, null, 15000);
                break;
            case error.status == HttpStatusCode.Forbidden:
                this.notifier.showError(error.error.message);
                // TODO: redirecionar o usuário p/ a tela de Dashboard
                break;
            case error.status == HttpStatusCode.Unauthorized:
                // this.authService.refreshTokenIfAvailable().subscribe((response) => {
                //     if (!response) {
                //         this.authService.logout();
                //     }
                // });
                this.notifier.showError(error.error.message);
                break;
            case this.isErrorCodeBetween402And499(error):
                this.notifier.showError(error.error.message);
                break;

            default:
                break;
        }

        if (hideSpinner) {
            this.spinner.hide();
        }
    }

    private isErrorCodeBetween402And499(error: HttpErrorResponse) {
        return error.status >= 402 && error.status < 500;
    }
}
