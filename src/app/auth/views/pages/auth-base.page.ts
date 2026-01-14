import { Component, OnInit } from "@angular/core";
import { BaseAppPageView } from "../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../shared/models/page-route";
import { BasePageView } from "../../../shared/views/base-page.view";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { NgxSpinner, NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: "auth-base-page",
    templateUrl: "./auth-base.page.html",
    styles: ``,
})
export class AuthBasePage extends BasePageView implements OnInit {
    constructor(private readonly authService: AuthService, private readonly router: Router, private readonly spinner: NgxSpinnerService) {
        super();
    }

    ngOnInit(): void {
        this.redirectToInternalAppIfLoggedIn();
    }

    private redirectToInternalAppIfLoggedIn(): void {
        if (this.authService.isLoggedIn()) {
            this.authService.redirectToApp();
        } else {
            this.authService.refreshTokenIfAvailable().subscribe({
                next: () => {
                    if (this.authService.isLoggedIn()) {
                        this.authService.redirectToApp();
                    }
                },
                error: () => {
                    this.spinner.hide();
                },
            });
        }
    }
}
