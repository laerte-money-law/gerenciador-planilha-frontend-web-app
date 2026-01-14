import { HttpStatusCode } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../../../../auth/services/auth.service";
import { PageRoute } from "../../../../shared/models/page-route";
import { NotificationService } from "../../../../shared/services/notification.service";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { InputAutocompleteGooglemapsComponent } from "../../../../shared/views/components/atoms/input-autocomplete-googlemaps/input-autocomplete-googlemaps.component";
import { ClientQuotationsDto } from "../../../models/dto/client-insurance-company-quotation.dto";
import { QuotationStatusEnum } from "../../../models/enums/quotation-status.enum";
import { ClientQuotationService } from "../../../services/client-quotation.service";
import { UpdatePremiumFormComponent } from "src/app/shared/views/components/organisms/forms/update-premium/update-premium.form.component";
import { AdminQuotationService } from "src/app/admin/services/admin-quotation.service";

@Component({
    selector: "client-insurance-company-quotation-details-page",
    templateUrl: "./client-insurance-company-quotation-details.page.html",
    styles: ``,
})
export class ClientInsuranceCompanyQuotationDetailsPage extends BaseAppPageView {
    clientCode: string;
    insuredCode: string;

    // TODO: tipar isso aqui
    quotationDetails: ClientQuotationsDto;

    updatePremiumFormComponent = UpdatePremiumFormComponent;

    public isQuotationApproved(quotation): boolean {
        return quotation?.status === QuotationStatusEnum.APPROVED;
    }

    constructor(
        private readonly pageService: PageService,
        private readonly clientQuotationService: ClientQuotationService,
        private readonly adminQuotationService: AdminQuotationService,
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
        this.loadQuotationDetails();
    }

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.CLIENT.INSURANCE_COMPANY.REGISTRATION(), "Cadastro nas seguradoras", "Seguradoras"),
            new PageRoute(this.URLS.PATHS.CLIENT.QUOTATIONS.ROOT(), "Cotações", "Cotações"),
            new PageRoute(this.URLS.PATHS.CLIENT.QUOTATIONS.DETAILS(), "Detalhes da cotação", "Detalhes"),
        ];
    }

    openQuotationDocument(insuranceCompanyRegistrationCode: string) {
        this.spinner.show();
        this.clientQuotationService.getQuotationDocument(this.insuredCode, insuranceCompanyRegistrationCode).subscribe({
            next: (response) => {
                this.spinner.hide();
                this.openPdfInNewTab(response);
            },
            error: (e) => {
                this.spinner.hide();
                if (e.status === HttpStatusCode.NotFound) {
                    this.notifier.showError("Nenhuma cotação encontrada.");
                } else {
                    throw e;
                }
            },
        });
    }

    onOpenUpdatePremiumModal(quotationCode: string) {
        this.adminQuotationService.setQuotationContext(this.clientCode, this.insuredCode, quotationCode);
    }

    onUpdatePremium() {
        console.log("Updating premium for insured code");
    }

    acceptProposal(insuranceCompanyRegistrationCode: string): void {
        this.spinner.show();
        this.clientQuotationService.acceptProposal(this.clientCode, this.insuredCode, insuranceCompanyRegistrationCode).subscribe({
            next: (response) => {
                this.spinner.hide();
                this.notifier.showSuccess("Proposta enviada com sucesso!");
                this.router.navigate([this.URLS.PATHS.CLIENT.POLICY.DETAILS(false, this.insuredCode, response.policyNumber)]);
                console.log("Enviou a proposta com sucesso", response);
            },
        });
    }

    getAddressFormatted(): string {
        return InputAutocompleteGooglemapsComponent.formatAddress({
            route: this.quotationDetails?.addressRoute,
            number: this.quotationDetails?.addressNumber,
            neighborhood: this.quotationDetails?.addressNeighborhood,
            city: this.quotationDetails?.addressCity,
            state: this.quotationDetails?.addressState,
            postalCode: this.quotationDetails?.addressZipCode,
        });
    }

    private loadQuotationDetails(): void {
        this.spinner.show();
        this.route.params.subscribe((params) => {
            this.insuredCode = params["insuredCode"];
            this.clientCode = params["clientCode"];

            this.clientQuotationService.getQuotationDetails(this.insuredCode).subscribe({
                next: (response) => {
                    this.spinner.hide();
                    console.log("quotation detail response", response);
                    this.quotationDetails = response;
                },
                error: (e) => {
                    this.spinner.hide();
                    this.router.navigate([this.URLS.PATHS.CLIENT.QUOTATIONS.ROOT()]);
                    throw e;
                },
            });
        });
    }

    private openPdfInNewTab(response): void {
        if (response.url) {
            const url = response.url;
            const newTab = window.open(url, "_blank");
            if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
                this.notifier.showError(
                    "O bloqueador de pop-up do seu navegador impediu a abertura do documento. Por favor, desative-o e tente novamente."
                );
            }
        } else if (response.pdfBase64) {
            // Convert base64 to Uint8Array
            const byteCharacters = atob(response.pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create a Blob with PDF type
            const fileBlob = new Blob([byteArray], { type: "application/pdf" });

            // Create an Object URL and open in a new tab
            const fileURL = URL.createObjectURL(fileBlob);
            const newTab = window.open(fileURL, "_blank");
            if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
                this.notifier.showError(
                    "O bloqueador de pop-up do seu navegador impediu a abertura do documento. Por favor, desative-o e tente novamente."
                );
            }
        } else {
            console.error("No document found");
        }
    }
}
