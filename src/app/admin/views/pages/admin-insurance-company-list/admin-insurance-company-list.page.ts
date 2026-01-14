import { Component } from "@angular/core";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { AdminInsuranceCompanyService } from "../../../services/admin-insurance-company.service";
import { NgxSpinnerService } from "ngx-spinner";
import { InsuranceCompanyDto } from "../../../models/insurance-company.dto";
import { Router } from "@angular/router";
import { NotificationService } from "../../../../shared/services/notification.service";
import * as _ from "lodash";

@Component({
    selector: "admin-insurance-company-list-page",
    templateUrl: "./admin-insurance-company-list.page.html",
    styles: ``,
})
export class AdminInsuranceCompanyListPage extends BaseAppPageView {
    allRecords: InsuranceCompanyDto[] = [];
    override getBreadcrumbs(): PageRoute[] {
        return [new PageRoute(this.URLS.PATHS.ADMIN.INSURANCE_COMPANY.ROOT(), "Seguradoras", "Seguradoras")];
    }

    constructor(
        private readonly pageService: PageService,
        private readonly spinner: NgxSpinnerService,
        private readonly router: Router,
        private readonly notifier: NotificationService,
        private readonly adminInsuranceCompanyService: AdminInsuranceCompanyService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());

        this.loadRecords();
    }

    onEdit(insuranceCompanyCode: string) {
        this.router.navigate([this.URLS.PATHS.ADMIN.INSURANCE_COMPANY.EDIT(false, insuranceCompanyCode)]);
    }

    onSwitchStatus(insuranceCompanyCode: string): void {
        this.spinner.show();
        this.adminInsuranceCompanyService.updateStatus(insuranceCompanyCode).subscribe({
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

    private loadRecords(): void {
        this.spinner.show();
        this.adminInsuranceCompanyService.findAll().subscribe({
            next: (response) => {
                this.allRecords = response;
                this.allRecords = _.orderBy(this.allRecords, ["status", "insuranceCompanyName"]);
                this.spinner.hide();
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }
}
