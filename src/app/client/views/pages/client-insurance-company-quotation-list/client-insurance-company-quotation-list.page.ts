import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../../../../auth/services/auth.service";
import { PageRoute } from "../../../../shared/models/page-route";
import { NotificationService } from "../../../../shared/services/notification.service";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { ClientQuotationsDto } from "../../../models/dto/client-insurance-company-quotation.dto";
import { ClientQuotationService, ClientQuotationsResponseDto } from "../../../services/client-quotation.service";
import { AdminQuotationService } from "src/app/admin/services/admin-quotation.service";
import { RemotePagination } from "src/app/shared/services/remote-pagination";

@Component({
    selector: "client-insurance-company-quotation-list-page",
    templateUrl: "./client-insurance-company-quotation-list.page.html",
    styles: ``,
})
export class ClientInsuranceCompanyQuotationListPage extends BaseAppPageView {
    clientCode: string;
    allRecords: ClientQuotationsDto[] = [];
    searchText = "";
    pagination = new RemotePagination((page) => this.loadPage(page));
    filteredList = []

    constructor(
        private readonly pageService: PageService,
        private readonly router: Router,
        private readonly notifier: NotificationService,
        private readonly clientQuotationService: ClientQuotationService,
        private readonly adminQuotationService: AdminQuotationService,
        private readonly authService: AuthService,
        private readonly spinner: NgxSpinnerService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        console.log('ROUTER URL:', this.router.url, 'isAdmin:', this.isAdmin());

        if (this.isAdmin()) {
            console.log('Chamando loadPage(1)...');

            this.loadPage(1);
        }    
    }

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.CLIENT.INSURANCE_COMPANY.REGISTRATION(), "Cadastro nas seguradoras", "Seguradoras"),
            new PageRoute(this.URLS.PATHS.CLIENT.QUOTATIONS.ROOT(), "Cotações", "Cotações"),
        ];
    }

    private readonly pageSize = 10;

    private loadPage(page: number): void {
        console.log('loadPage chamado | page =', page);

        this.spinner.show();

        if (this.isAdmin()) {
            this.adminQuotationService
            .findAllClientQuotations({ page, limit: this.pageSize })
            .subscribe({
                next: (response: ClientQuotationsResponseDto) => {
                console.log('ADMIN RESPONSE:', response);
                console.log('ADMIN DATA LENGTH:', response?.data?.length);
                console.log('ADMIN DATA:', response?.data);

                this.allRecords = response.data;
                this.filteredList = response.data;
                this.pagination.sync(response.data, response.meta);
                this.spinner.hide();
                },
                error: (e) => {
                console.error('ERROR AO BUSCAR COTAÇÕES ADMIN:', e);
                this.spinner.hide();
                },
            });

            return;
        }

        if (!this.clientCode) {
            this.spinner.hide();
            return;
        }

        this.clientQuotationService
            .findAllClientQuotations(this.clientCode, { page, limit: this.pageSize })
            .subscribe({
            next: (response: ClientQuotationsResponseDto) => {
                console.log('CLIENT RESPONSE:', response);
                console.log('CLIENT DATA LENGTH:', response?.data?.length);
                console.log('CLIENT DATA:', response?.data);

                this.allRecords = response.data;
                this.filteredList = response.data;
                this.pagination.sync(response.data, response.meta);
                this.spinner.hide();
            },
            error: (e) => {
                console.error('ERROR AO BUSCAR COTAÇÕES CLIENT:', e);
                this.spinner.hide();
            },
        });
    }



    onSearchFilterChange(): void {
        // TODO: implement search
    }

    onShowQuotationDetails(insuredCode: string): void {
        if (this.authService.isAdmin()) {
            const insuredQuotation = this.filteredList.find(clienQuotation => clienQuotation.code === insuredCode);
            this.router.navigate([this.URLS.PATHS.CLIENT.QUOTATIONS.DETAILS(false, insuredQuotation.clientCode, insuredCode)]);
        }else {
            this.router.navigate([this.URLS.PATHS.CLIENT.QUOTATIONS.DETAILS(false, this.clientCode, insuredCode)]);
        }
    }

    onDeleteQuotation(insuredCode: string): void {
        this.spinner.show();
        this.clientQuotationService.deleteQuotation(insuredCode).subscribe({
            next: () => {
                this.notifier.showSuccess("Cotação excluida com sucesso!");
                this.loadPage(this.pagination.getCurrentPage());
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }

    onGoToPolicyDetailsPage(insuredDocument: string): void {
        const policyNumber = this.allRecords
            .find((insuredQuotation) => insuredQuotation.document === insuredDocument)
            .quotationInsuranceCompanies.find((quotation) => quotation.policyNumber).policyNumber;
        this.router.navigate([this.URLS.PATHS.CLIENT.POLICY.DETAILS(false, insuredDocument, policyNumber)]);
    }

    isAdmin(): boolean {
        return this.router.url.includes("/admin");
    }

    handleSubsidiaryChange(companyCode: string) {
        this.clientCode = companyCode;
     this.loadPage(1);
    }
}
