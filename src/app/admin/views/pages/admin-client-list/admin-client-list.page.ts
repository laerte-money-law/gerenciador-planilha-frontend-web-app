import { Component, ViewChild } from "@angular/core";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { NgxSpinnerService } from "ngx-spinner";
import { AdminClientService } from "../../../services/admin-client.service";
import { ClientDto } from "../../../models/client.dto";
import { NotificationService } from "../../../../shared/services/notification.service";
import { Pagination } from "../../../../shared/utils/pagination";
import { Router } from "@angular/router";
import { Constants } from "../../../../shared/utils/constants";

@Component({
    selector: "admin-client-list-page",
    templateUrl: "./admin-client-list.page.html",
    styles: ``,
})
export class AdminClientListPage extends BaseAppPageView {
    @ViewChild("deleteSwal") deleteSwal;
    allRecords: ClientDto[] = [];
    filteredList: ClientDto[] = [];
    pagination: Pagination<ClientDto>;
    searchText = "";
    selectedClient: ClientDto;
    override getBreadcrumbs(): PageRoute[] {
        return [new PageRoute(this.URLS.PATHS.ADMIN.CLIENT.ROOT(), "Clientes", "Clientes")];
    }
    constructor(
        private readonly pageService: PageService,
        private readonly spinner: NgxSpinnerService,
        private readonly router: Router,
        private readonly notifier: NotificationService,
        private readonly adminClientService: AdminClientService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadRecords();
    }

    onDelete(code: string): void {
        this.selectedClient = this.allRecords.find((c) => c.code === code);
        setTimeout(() => {
            this.deleteSwal.fire();
        }, Constants.DEFAULT_APP_TIMEOUT);
    }

    onEdit(code: string): void {
        this.router.navigate([this.URLS.PATHS.ADMIN.CLIENT.EDIT(false, code)]);
    }

    onUpdateStatus(code: string): void {
        this.spinner.show();
        this.adminClientService.updateStatus(code).subscribe({
            next: () => {
                this.loadRecords();
                this.spinner.hide();
                this.notifier.showSuccess("Status alterado com sucesso!");
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }

    onSeeInsuranceCompaniesClientRegistration(code: string): void {
        this.router.navigate([this.URLS.PATHS.ADMIN.CLIENT.INSURANCE_COMPANIES_REGISTRATION(false, code)]);
    }

    onDeleteConfirmation(): void {
        this.spinner.show();
        this.adminClientService.deleteClient(this.selectedClient.code).subscribe({
            next: () => {
                this.loadRecords();
                this.notifier.showSuccess("Cliente excluido com sucesso!");
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }

    onSearchFilterChange(): void {
        const search = this.searchText.toLowerCase().trim();

        this.filteredList = this.allRecords.filter(
            (e) => e.companyName?.toLowerCase().indexOf(search) >= 0 || e.cnpj?.removeNonDigits().indexOf(search) >= 0
        );
        this.refreshPagination();
    }

    private loadRecords(): void {
        this.spinner.show();

        this.adminClientService.findAllClients().subscribe({
            next: (response) => {
                console.log("clients", response);

                this.allRecords = response;
                this.filteredList = this.allRecords;
                this.refreshPagination();

                this.spinner.hide();
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }

    private refreshPagination(): void {
        this.pagination = new Pagination(this.filteredList);
    }
}
