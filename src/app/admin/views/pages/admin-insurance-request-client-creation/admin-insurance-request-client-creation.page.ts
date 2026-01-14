import { Component, OnInit } from "@angular/core";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { NotificationService } from "../../../../shared/services/notification.service";
import { PageService } from "../../../../shared/services/page.service";
import { AdminDepositGuideService } from "src/app/admin/services/admin-deposit-guide.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ClientDto } from "src/app/admin/models/client.dto";
import { ClientInsuranceCompanyRegistrationDto } from "src/app/client/models/dto/client-insurance-company-registration.dto";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientInsuranceCompanyService } from "src/app/client/services/client-insurance-company.service";
import { DepositGuideDto } from "src/app/admin/models/deposit-guide.dto";

@Component({
    selector: "admin-insurance-request-client-creation-page",
    templateUrl: "./admin-insurance-request-client-creation.page.html",
    styles: ``,
})
export class AdminInsuranceRequestClientCreationPage extends BaseAppPageView implements OnInit {
    client: ClientDto = null;
    registrations: ClientInsuranceCompanyRegistrationDto[] = null;
    selectedInsuranceCompanies: ClientInsuranceCompanyRegistrationDto[] = [];
    depositGuide: DepositGuideDto = null;

    constructor(
        private readonly pageService: PageService,
        private readonly spinner: NgxSpinnerService,
        private readonly notifier: NotificationService,
        private readonly adminDepositGuideService: AdminDepositGuideService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly clientInsuranceCompanyService: ClientInsuranceCompanyService
    ) {
        super();
    }

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.ADMIN.CLIENT.ROOT(), "Seguradoras", "Seguradoras"),
            new PageRoute(this.URLS.PATHS.ADMIN.CLIENT.CREATE(), "Solicitar Cadastro do Cliente", "Cadastrar cliente"),
        ];
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadRecords();
    }

    onSelectInsuranceCompany(code: string): void {
        if (this.selectedInsuranceCompanies.map((item) => item.insuranceCompanyRegistrationCode).includes(code)) {
            this.selectedInsuranceCompanies = this.selectedInsuranceCompanies.filter(
                (item) => item.insuranceCompanyRegistrationCode !== code
            );
        } else {
            this.selectedInsuranceCompanies.push(this.registrations.find((item) => item.insuranceCompanyRegistrationCode === code));
        }
    }

    onRequestInsuranceProposal(): void {
        this.clientInsuranceCompanyService.setInsuranceCompaniesSelected(this.selectedInsuranceCompanies);
        this.clientInsuranceCompanyService.setDepositGuide(this.depositGuide);
        this.clientInsuranceCompanyService.setClientCode(this.client.code);
        this.router.navigate([this.URLS.PATHS.ADMIN.QUOTATIONS.REQUEST(false, "11")]);
    }

    private loadRecords(): void {
        const depositGuideId = this.route.snapshot.paramMap.get("depositGuideId"); // or whatever the param is named

        if (!depositGuideId) {
            this.notifier.showError("É preciso selecionar uma guia para poder solicitar o cadastro do cliente");
            return;
        }

        this.spinner.show();

        this.adminDepositGuideService.addClientByDepositGuide(depositGuideId).subscribe({
            next: (response: {
                client: ClientDto;
                registrations: ClientInsuranceCompanyRegistrationDto[];
                depositGuide: DepositGuideDto;
            }) => {
                this.notifier.showSuccess("Solicitação de cadastro do cliente enviada com sucesso.");
                this.spinner.hide();
                this.client = response.client;
                this.registrations = response.registrations;
                this.depositGuide = response.depositGuide;
            },
            error: (e) => {
                this.spinner.hide();
                this.notifier.showError("Erro ao cadastrar cliente pela guia de depósito");
                throw e;
            },
        });
    }
}
