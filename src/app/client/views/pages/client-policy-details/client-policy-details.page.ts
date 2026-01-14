import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../../../../auth/services/auth.service";
import { PageRoute } from "../../../../shared/models/page-route";
import { NotificationService } from "../../../../shared/services/notification.service";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { InputAutocompleteGooglemapsComponent } from "../../../../shared/views/components/atoms/input-autocomplete-googlemaps/input-autocomplete-googlemaps.component";
import { ClientInsuranceCompanyService } from "../../../services/client-insurance-company.service";
import { ClientPolicyService } from "../../../services/client-policy.service";
import { AppealType, AppealTypeEnum } from "../../../models/enums/appeal-type.enum";

@Component({
    selector: "client-policy-details-page",
    templateUrl: "./client-policy-details.page.html",
    styles: ``,
})
export class ClientPolicyDetailsPage extends BaseAppPageView implements OnInit {
    policyNumber: string;
    insuredDocument: string;
    // policy: ClientPolicyDto;
    // ToDo: tipar isso aqui
    policy: any;

    constructor(
        private readonly pageService: PageService,
        private readonly clientPolicyService: ClientPolicyService,
        private readonly clientInsuranceCompanyService: ClientInsuranceCompanyService,
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
        this.loadPolicy();
    }

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.CLIENT.POLICY.ROOT(), "Apólices", "Apólices"),
            new PageRoute(this.URLS.PATHS.CLIENT.POLICY.DETAILS(), "Detalhes da apólice", "Detalhes"),
        ];
    }

    //getAppealTypeText = (appealType: AppealTypeEnum): string => AppealType.getTextFromKey(appealType);
    getAppealTypeText = (value: any): string => AppealType.getTextFromAny(value);


    formatInsuredAddress(): string {
        if (!this.policy) return "";
        // ToDo: padronizar o nome das variáveis de endereço no front e no back
        return this.formatAddress(
            this.policy.insured.addressRoute,
            this.policy.insured.addressNumber,
            this.policy.insured.addressNeighborhood,
            this.policy.insured.addressCity,
            this.policy.insured.addressState,
            this.policy.insured.addressZipCode
        );
    }

    formatClientAddress(): string {
        if (!this.policy || !this.policy.client.address) return "";
        // ToDo: padronizar o nome das variáveis de endereço no front e no back
        return this.formatAddress(
            this.policy.client.address.split(",")[0],
            this.policy.client.address.split(",")[1],
            this.policy.client.neighborhood,
            this.policy.client.city,
            this.policy.client.state,
            this.policy.client.cep
        );
    }
    formatInsuranceCompanyAddress(): string {
        if (!this.policy || !this.policy.insuranceCompany.address) return "";
        // ToDo: padronizar o nome das variáveis de endereço no front e no back
        return this.formatAddress(
            this.policy.insuranceCompany.address.split(",")[0],
            this.policy.insuranceCompany.address.split(",")[1],
            this.policy.insuranceCompany.neighborhood,
            this.policy.insuranceCompany.city,
            this.policy.insuranceCompany.state,
            this.policy.insuranceCompany.cep
        );
    }

    onOpenBankSlip(): void {
        if (this.policy?.bankSlipUrl) {
            const newTab = window.open(this.policy.bankSlipUrl, "_blank");
            if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
                this.notifier.showError(
                    "O bloqueador de pop-up do seu navegador impediu a abertura do documento. Por favor, desative-o e tente novamente."
                );
            }
        } else {
            this.spinner.show();
            this.clientPolicyService.getPolicyBankSlipDocument(this.insuredDocument, this.policyNumber).subscribe({
                next: (response) => {
                    this.openPdfInNewTab(response.base64);
                    this.spinner.hide();
                },
            });
        }
    }

    onOpenPolicyDocument(): void {
        if (this.policy?.proposalUrl) {
            const newTab = window.open(this.policy.proposalUrl, "_blank");
            if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
                this.notifier.showError(
                    "O bloqueador de pop-up do seu navegador impediu a abertura do documento. Por favor, desative-o e tente novamente."
                );
            }
        } else {
            this.spinner.show();
            this.clientPolicyService.getPolicyDocument(this.insuredDocument, this.policyNumber).subscribe({
                next: (response) => {
                    this.openPdfInNewTab(response.base64);
                    this.spinner.hide();
                },
            });
        }
    }

    onDownloadCertificate(type: "admin" | "susep"): void {
        this.spinner.show();
        this.clientInsuranceCompanyService.downloadCertificate(this.policy.insuranceCompany.registrationCode, type).subscribe({
            next: (response) => {
                this.openPdfInNewTab(response.base64);
                this.spinner.hide();
            },
        });
    }

    private loadPolicy(): void {
        this.spinner.show();
        this.route.params.subscribe((params) => {
            this.policyNumber = params["policyNumber"];
            this.insuredDocument = params["insuredDocument"];

            this.clientPolicyService.getPolicyDetails(this.insuredDocument, this.policyNumber).subscribe({
                next: (response) => {
                    this.spinner.hide();
                    console.log("policy details response", response);
                    this.policy = response;
                },
                error: (e) => {
                    this.spinner.hide();
                    this.router.navigate([this.URLS.PATHS.CLIENT.POLICY.ROOT()]);
                    throw e;
                },
            });
        });
    }

    private formatAddress(route: string, number: string, neighborhood: string, city: string, state: string, postalCode: string): string {
        let addressFormatted = "";
        if (this.policy) {
            addressFormatted = InputAutocompleteGooglemapsComponent.formatAddress({
                route,
                number,
                neighborhood,
                city,
                state,
                postalCode,
            });
        }
        return addressFormatted;
    }

    private openPdfInNewTab(documentBase64: string): void {
        // Convert base64 to Uint8Array
        const byteCharacters = atob(documentBase64);
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
    }
}
