import { Component, OnInit } from "@angular/core";
import { PageRoute } from "../../../../shared/models/page-route";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { AuthService } from "../../../../auth/services/auth.service";

@Component({
    selector: "client-insurance-company-quotation-request-page",
    templateUrl: "./client-insurance-company-quotation-request.page.html",
    styles: ``,
})
export class ClientInsuranceCompanyQuotationRequestPage extends BaseAppPageView implements OnInit {
    clientCode: string;
    constructor(private readonly pageService: PageService, private readonly authService: AuthService) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.clientCode = this.authService.userClientInfo.clientCode;
    }

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.CLIENT.INSURANCE_COMPANY.REGISTRATION(), "Cadastro nas seguradoras", "Seguradoras"),
            new PageRoute(this.URLS.PATHS.CLIENT.QUOTATIONS.ROOT(), "Cotações", "Cotações"),
            new PageRoute(this.URLS.PATHS.CLIENT.QUOTATIONS.REQUEST(), "Solicitar Cotação", "Solicitar"),
        ];
    }
}
