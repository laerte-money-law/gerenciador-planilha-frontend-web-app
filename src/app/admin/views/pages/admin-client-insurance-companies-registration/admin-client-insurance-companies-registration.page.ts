import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageService } from "../../../../shared/services/page.service";
import { PageRoute } from "../../../../shared/models/page-route";
import { ClientDto } from "../../../models/client.dto";
import { AdminClientService } from "../../../services/admin-client.service";

@Component({
    selector: "admin-client-insurance-companies-registration-page",
    templateUrl: "./admin-client-insurance-companies-registration.page.html",
    styles: ``,
})
export class AdminClientInsuranceCompaniesRegistrationPage extends BaseAppPageView implements OnInit {
    clientCode: string;
    client: ClientDto;

    constructor(
        private readonly pageService: PageService,
        private readonly route: ActivatedRoute,
        private readonly adminClientService: AdminClientService
    ) {
        super();
    }

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.ADMIN.CLIENT.ROOT(), "Clientes", "Clientes"),
            new PageRoute(this.URLS.PATHS.CLIENT.DASHBOARD(), "Seguradoras", "Seguradoras"),
            new PageRoute(this.URLS.PATHS.CLIENT.DASHBOARD(), "Cadastro nas seguradoras", "Cadastro"),
        ];
    }
    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());

        this.route.params.subscribe((params) => {
            this.clientCode = params["code"];
            this.adminClientService.findByCode(this.clientCode).subscribe({
                next: (response) => {
                    this.client = response;
                },
            });
        });
    }
}
