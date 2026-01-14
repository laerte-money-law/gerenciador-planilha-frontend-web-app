import { Component } from "@angular/core";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { PageService } from "../../../../shared/services/page.service";
import { AuthService } from "../../../../auth/services/auth.service";

@Component({
    selector: "client-insurance-company-registration-page",
    templateUrl: "./client-insurance-company-registration.page.html",
    styles: ``,
})
export class ClientInsuranceCompanyRegistrationPage extends BaseAppPageView {
    clientCode: string;
    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.CLIENT.INSURANCE_COMPANY.REGISTRATION(), "Registro da empresa nas seguradoras", "Seguradoras"),
        ];
    }
    constructor(private readonly pageService: PageService, private readonly authService: AuthService) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.clientCode = this.authService.userClientInfo.clientCode;
    }
}
