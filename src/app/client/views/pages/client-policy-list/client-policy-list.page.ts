import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../../../../auth/services/auth.service";
import { PageRoute } from "../../../../shared/models/page-route";
import { NotificationService } from "../../../../shared/services/notification.service";
import { PageService } from "../../../../shared/services/page.service";
import { Pagination } from "../../../../shared/utils/pagination";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { ClientPolicyService } from "../../../services/client-policy.service";

@Component({
    selector: "client-policy-list-page",
    templateUrl: "./client-policy-list.page.html",
    styles: ``,
})
export class ClientPolicyListPage extends BaseAppPageView implements OnInit {
    allRecords: any[] = [];
    filteredList: any[] = [];
    pagination: Pagination<any>;
    searchText = "";

    constructor(
        private readonly pageService: PageService,
        private readonly clientPolicyService: ClientPolicyService,
        private readonly authService: AuthService,
        private readonly spinner: NgxSpinnerService,
        private readonly notifier: NotificationService,
        private readonly router: Router,
        private readonly route: ActivatedRoute
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
    }

    override getBreadcrumbs(): PageRoute[] {
        return [new PageRoute(this.URLS.PATHS.CLIENT.POLICY.ROOT(), "Lista de Apólices", "Apólices")];
    }

    onShowPolicyDetails(insuredDocument: string, policyNumber: string): void {
        this.router.navigate([this.URLS.PATHS.CLIENT.POLICY.DETAILS(false, insuredDocument, policyNumber)]);
    }

    onSearchFilterChange(): void {
        const search = this.searchText.toLowerCase().trim();

        this.filteredList = this.allRecords.filter(
            (policy) =>
                policy.policyNumber.indexOf(search) >= 0 ||
                policy.insured.caseNumber.indexOf(search) >= 0 ||
                policy.client.companyName.toLowerCase().indexOf(search) >= 0 ||
                policy.client.cnpj.removeNonDigits().indexOf(search) >= 0 ||
                policy.insured.name.toLowerCase().indexOf(search) >= 0 ||
                policy.insured.document.removeNonDigits().indexOf(search) >= 0
        );
        this.refreshPagination();
    }

    private loadPolicies(clientCode: string): void {
        this.spinner.show();
        this.clientPolicyService.getAllPolicies(clientCode).subscribe({
            next: (response) => {
                console.log("policies response", response);
                this.allRecords = response;
                this.allRecords = response;
                this.filteredList = this.allRecords;
                this.refreshPagination();
                this.spinner.hide();
            },
            error: (e) => {
                this.spinner.hide();
                this.router.navigate([this.URLS.PATHS.CLIENT.DASHBOARD()]);
                throw e;
            },
        });
    }

    private refreshPagination(): void {
        this.pagination = new Pagination(this.filteredList);
    }

    handleSubsidiaryChange(companyCode: string): void {
        this.loadPolicies(companyCode);
    }
}
