import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ClientDto } from "../../../../../admin/models/client.dto";
import { NotificationService } from "../../../../../shared/services/notification.service";
import { BaseView } from "../../../../../shared/views/base.view";
import { ClientInsuranceCompanyRegistrationDto } from "../../../../models/dto/client-insurance-company-registration.dto";
import { InsuranceCompanyClientRegistrationStatusEnum } from "../../../../models/enums/insurance-company-client-registration-status.enum";
import { ClientInsuranceCompanyService } from "../../../../services/client-insurance-company.service";
import { AuthService } from "../../../../../auth/services/auth.service";
import { AdminClientService } from "../../../../../admin/services/admin-client.service";
import { catchError, throwError } from "rxjs";

@Component({
    selector: "app-client-insurance-company-registration-list",
    templateUrl: "./client-insurance-company-registration-list.component.html",
    styles: ``,
})
export class ClientInsuranceCompanyRegistrationListComponent extends BaseView implements OnInit {
    //note: how clientCode is being loaded?
    @Input("clientCode") clientCode: string;
    @Input("showQuotationButton") showQuotationButton: boolean = false;
    @Input("client") client: ClientDto;
    clientInsuranceCompanyRegistrations: ClientInsuranceCompanyRegistrationDto[];
    selectedInsuranceCompanies: ClientInsuranceCompanyRegistrationDto[] = [];
    STATUS_IN_INSURANCE_COMPANY = InsuranceCompanyClientRegistrationStatusEnum;

    selectedClientCode = null;

    public get isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    constructor(
        private readonly clientInsuranceCompanyService: ClientInsuranceCompanyService,
        private readonly adminClientService: AdminClientService,
        private readonly spinner: NgxSpinnerService,
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly notifier: NotificationService
    ) {
        super();
    }

    ngOnInit(): void {
        this.findAllClientInsuranceCompaniesResgitrations();
    }

    showSelectionCheckbox(code: string): boolean {
        return (
            this.clientInsuranceCompanyRegistrations.find((item) => item.insuranceCompanyRegistrationCode === code)
                .statusInInsuranceCompany === InsuranceCompanyClientRegistrationStatusEnum.APPROVED
        );
    }

    onRequestInsuranceProposal(): void {
        if (this.selectedInsuranceCompanies.length === 0) {
            this.notifier.showError("É preciso selecionar pelo menos uma seguradora");
        }

        this.clientInsuranceCompanyService.setInsuranceCompaniesSelected(this.selectedInsuranceCompanies);

        if (this.authService.isAdmin()) {
            this.clientInsuranceCompanyService.setClientCode(this.clientCode);
            this.router.navigate([this.URLS.PATHS.ADMIN.QUOTATIONS.REQUEST()]);
        } else {
            this.clientInsuranceCompanyService.setClientCode(this.selectedClientCode);
            this.router.navigate([this.URLS.PATHS.CLIENT.QUOTATIONS.REQUEST()]);
        }
    }

    onUpdateClientRegistration(insuranceCompanyRegistrationCode: string): void {
        this.spinner.show();

        this.adminClientService
            .updateRegistration(this.clientCode, insuranceCompanyRegistrationCode)
            .pipe(
                catchError((adminError) => {
                    if (!this.selectedClientCode) {
                        return throwError(() => adminError);
                    }

                    return this.clientInsuranceCompanyService.updateRegistration(insuranceCompanyRegistrationCode, this.selectedClientCode);
                })
            )
            .subscribe({
                next: () => {
                    this.findAllClientInsuranceCompaniesResgitrations();
                    this.spinner.hide();
                },
                error: (e) => {
                    console.error("Both update attempts failed", e);
                    this.spinner.hide();
                },
            });
    }

    onSelectInsuranceCompany(code: string): void {
        if (this.selectedInsuranceCompanies.map((item) => item.insuranceCompanyRegistrationCode).includes(code)) {
            this.selectedInsuranceCompanies = this.selectedInsuranceCompanies.filter(
                (item) => item.insuranceCompanyRegistrationCode !== code
            );
        } else {
            this.selectedInsuranceCompanies.push(
                this.clientInsuranceCompanyRegistrations.find((item) => item.insuranceCompanyRegistrationCode === code)
            );
        }
    }

    handleSubsidiaryChange(companyCode: string) {
        this.selectedClientCode = companyCode;
        this.findAllClientInsuranceRegisterForCodeClient(companyCode);
    }

    private findAllClientInsuranceCompaniesResgitrations(): void {
        if (!this.clientCode) {
            this.router.navigate([this.URLS.PATHS.CLIENT.ROOT()]);
        }

        this.spinner.show();
        if (this.authService.userInfo.isAdmin()) {
            this.adminClientService.findClientInsuranceCompanyRegistrations(this.clientCode).subscribe({
                next: (response) => {
                    console.log("ClientInsuranceCompanyRegistrations", response);
                    this.clientInsuranceCompanyRegistrations = response;
                    this.spinner.hide();
                },
                error: (e) => {
                    this.spinner.hide();
                    throw e;
                },
            });
        }
    }

    private findAllClientInsuranceRegisterForCodeClient(clientCode: string) {
        this.clientInsuranceCompanyService.findAllClientInsuranceCompaniesResgitrations(clientCode).subscribe({
            next: (response) => {
                console.log("ClientInsuranceCompanyRegistrations", response);
                this.clientInsuranceCompanyRegistrations = response;
                this.spinner.hide();
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }
}
