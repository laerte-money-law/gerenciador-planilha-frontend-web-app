import { Component, ViewChild } from "@angular/core";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageService } from "../../../../shared/services/page.service";
import { PageRoute } from "../../../../shared/models/page-route";
import { AdminConsultantService } from "../../../services/admin-consultant.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "../../../../shared/services/notification.service";
import { ConsultantDto } from "../../../models/consultant.dto";
import { Pagination } from "../../../../shared/utils/pagination";
import { Constants } from "../../../../shared/utils/constants";

@Component({
    selector: "admin-consultant-list-page",
    templateUrl: "./admin-consultant-list.page.html",
    styles: ``,
})
export class AdminConsultantListPage extends BaseAppPageView {
    @ViewChild("deleteSwal") deleteSwal;
    allRecords: ConsultantDto[] = [];
    filteredList: ConsultantDto[] = [];
    pagination: Pagination<ConsultantDto>;
    searchText = "";
    selectedConsultant: ConsultantDto;

    override getBreadcrumbs(): PageRoute[] {
        return [new PageRoute(this.URLS.PATHS.ADMIN.CONSULTANT.ROOT(), "Consultores", "Consultores")];
    }
    constructor(
        private readonly pageService: PageService,
        private readonly spinner: NgxSpinnerService,
        private readonly router: Router,
        private readonly notifier: NotificationService,
        private readonly adminConsultantService: AdminConsultantService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadRecords();
    }

    onSearchFilterChange(): void {
        const search = this.searchText.toLowerCase().trim();

        this.filteredList = this.allRecords.filter(
            (e) =>
                e.name?.toLowerCase().indexOf(search) >= 0 ||
                e.email?.toLowerCase().indexOf(search) >= 0 ||
                e.phone?.removeNonDigits().indexOf(search) >= 0
        );
        this.refreshPagination();
    }

    onEdit(code: string): void {
        this.router.navigate([this.URLS.PATHS.ADMIN.CONSULTANT.EDIT(false, code)]);
    }

    onUpdateStatus(code: string): void {
        this.spinner.show();
        this.adminConsultantService.updateStatus(code).subscribe({
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

    onDelete(code: string): void {
        this.selectedConsultant = this.allRecords.find((c) => c.code === code);
        setTimeout(() => {
            this.deleteSwal.fire();
        }, Constants.DEFAULT_APP_TIMEOUT);
    }

    onDeleteConfirmation(): void {
        this.spinner.show();
        this.adminConsultantService.deleteConsultant(this.selectedConsultant.code).subscribe({
            next: () => {
                this.loadRecords();
                this.spinner.hide();
                this.notifier.showSuccess("Consultor excluido com sucesso!");
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }

    private loadRecords(): void {
        this.spinner.show();

        this.adminConsultantService.findAllConsultants().subscribe({
            next: (response) => {
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
