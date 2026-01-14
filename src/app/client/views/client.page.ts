import { Component, OnInit } from "@angular/core";
import { BaseView } from "../../shared/views/base.view";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";
import { ModalService } from "../../shared/services/modal.service";

@Component({
    selector: "client-page",
    templateUrl: "./client.page.html",
    styles: ``,
})
export class ClientPage extends BaseView implements OnInit {
    constructor(private readonly authService: AuthService, private readonly router: Router) {
        super();
    }

    isMobile = false;

    ngOnInit(): void {
        this.checkIfMobile();
        window.addEventListener('resize', () => this.checkIfMobile());
    }

    checkIfMobile(): void {
        this.isMobile = window.innerWidth <= 768;
    }

    private redirectToAuthModuleIfNotLoggedIn(): void {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate([this.URLS.PATHS.AUTH.ROOT()]);
        }
    }
}
