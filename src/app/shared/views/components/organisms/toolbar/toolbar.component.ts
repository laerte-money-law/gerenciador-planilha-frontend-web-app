import { Component, Input, OnInit } from "@angular/core";
import { BaseView } from "../../../base.view";
import { PageRoute } from "../../../../models/page-route";
import { PageService } from "../../../../services/page.service";
import { AuthService } from "../../../../../auth/services/auth.service";
import { UserClientInfoDto } from "../../../../../client/models/dto/user-client-info.dto";
import { Router } from "@angular/router";

interface AdminToolbarInfo {
    numberPolicies: number;
    numberClients: number;
    premiumValueReceived: number,
    policiesSummaryDTO: {
        numberPoliciesActives: number,
        numberPoliciesCancelled: number,
        numberPoliciesNearToDueDate: number
    }
}

@Component({
    selector: "app-toolbar",
    templateUrl: "./toolbar.component.html",
    styles: ``,
})
export class ToolbarComponent extends BaseView implements OnInit {
    @Input() pageRoute: PageRoute;
    @Input() breadcrumbs: PageRoute[] = [];
    client: UserClientInfoDto;
    currentUrl: string;

    adminToolbarInfo: AdminToolbarInfo = {
        numberPolicies: 0,
        numberClients: 0,
        premiumValueReceived: 0,
        policiesSummaryDTO: {
            numberPoliciesActives: 0,
            numberPoliciesCancelled: 0,
            numberPoliciesNearToDueDate: 0
        }
    }

    constructor(
        private readonly pageService: PageService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
        super();
        this.currentUrl = router.url;
    }

    shouldShowCotationButton(): boolean {
        return this.client && this.router.url === "/cliente/inicio";
    }

    ngOnInit(): void {
        this.pageService.breadcrumbs$.subscribe((breadcrumbs) => {
            this.breadcrumbs = breadcrumbs;
        });
        this.client = this.authService.userClientInfo;
    }

}
