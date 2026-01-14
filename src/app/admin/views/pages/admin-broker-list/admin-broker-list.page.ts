import { Component } from "@angular/core";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";

@Component({
    selector: "admin-broker-list-page",
    templateUrl: "./admin-broker-list.page.html",
    styles: ``,
})
export class AdminBrokerListPage extends BaseAppPageView {
    override getBreadcrumbs(): PageRoute[] {
        return [new PageRoute(this.URLS.PATHS.ADMIN.BROKERS.ROOT(), "Corretoras", "Corretoras")];
    }

    constructor(private readonly pageService: PageService) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
    }
}
