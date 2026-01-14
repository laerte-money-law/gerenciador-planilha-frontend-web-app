import { Component } from "@angular/core";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";

@Component({
    selector: "admin-billing-list-page",
    templateUrl: "./admin-billing-list.page.html",
    styles: ``,
})
export class AdminBillingListPage extends BaseAppPageView {
    override getBreadcrumbs(): PageRoute[] {
        return [new PageRoute(this.URLS.PATHS.ADMIN.BILLING.ROOT(), "Faturamento", "Faturamento")];
    }
    constructor(private readonly pageService: PageService) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
    }
}
