import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseAppPageFormView } from "../../../../shared/views/base-app-page-form.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { PageService } from "../../../../shared/services/page.service";
import { Router } from "@angular/router";
import { BaseValidator } from "../../../../shared/validators/base.validator";
import { CnpjValidator } from "../../../../shared/validators/cnpj.validator";
import { NumberInputTextModifier } from "../../../../shared/views/components/atoms/input-text/input-text-modifiers";
import { Suggestion } from "../../../../shared/views/components/atoms/input-autocomplete-single-choice/input-autocomplete-single-choice.component";
import { ClientDto } from "../../../models/client.dto";
import { InputTextComponent } from "src/app/shared/views/components/atoms/input-text/input-text.component";
import { InputDateComponent } from "src/app/shared/views/components/atoms/input-date/input-date.component";
import { InsurancePolicyFormDto } from "src/app/admin/models/forms/admin-policy-save.form.dto";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "src/app/shared/services/notification.service";
import { AdminPolicyService } from "src/app/admin/services/admin-policy.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { AdminInsuranceCompanyService } from "src/app/admin/services/admin-insurance-company.service";
import { InsuranceCompanyDto } from "src/app/admin/models/insurance-company.dto";
import { ClientInsuranceCompanyService } from "src/app/client/services/client-insurance-company.service";
import { ClientInsuredService } from "src/app/client/services/client-insured.service";
import { AdminClientService } from "src/app/admin/services/admin-client.service";
import { InsuredDto } from "src/app/admin/models/insured.dto";
import { SaveInsuredFormComponent } from "src/app/shared/views/components/organisms/forms/save-insured/save-insured.form.component";
import { SaveClientFormComponent } from "src/app/shared/views/components/organisms/forms/save-client/save-client.form.component";
import { SaveInsuranceCompanyFormComponent } from "src/app/shared/views/components/organisms/forms/save-insurance-company/save-insurance-company.form.component";
import { Modalities } from "src/app/client/models/enums/modality.enum";
import {
    SelectOption,
    SelectSingleChoiceComponent,
} from "src/app/shared/views/components/atoms/select-single-choice/select-single-choice.component";

@Component({
    selector: "admin-policy-save-page",
    templateUrl: "./admin-policy-save.page.html",
    styles: ``,
})
export class AdminPolicySavePage extends BaseAppPageFormView implements OnInit {
    CNPJ_MASK = BaseValidator.MASKS.CNPJ;
    PROCESS_NUMBER_MASK = BaseValidator.MASKS.NUMERO_PROCESSO;

    cnpjValidator: CnpjValidator = new CnpjValidator();
    numberInputTextModifier = new NumberInputTextModifier("");

    autocompleteClientSuggestions: Suggestion[] = [];
    autocompleteInsuredSuggestions: Suggestion[] = [];
    autocompleteInsuranceCompanySuggestions: Suggestion[] = [];

    clientSelected: ClientDto;
    insuredSelected: InsuredDto;
    insuranceCompanySelected: InsuranceCompanyDto;

    clients: ClientDto[] = [];
    insureds: InsuredDto[] = [];
    insuranceCompanies: InsuranceCompanyDto[] = [];

    modalitySelectOptions: SelectOption[] = Modalities.toList().map((m) => ({ value: m.key, text: m.text }));

    @ViewChild("processNumber") processNumber: InputTextComponent;
    @ViewChild("policyNumber") policyNumber: InputTextComponent;
    @ViewChild("proposalNumber") proposalNumber: InputTextComponent;
    @ViewChild("insuranceBranch") insuranceBranch: InputTextComponent;
    @ViewChild("insuredCpf") insuredCpf: InputTextComponent;
    @ViewChild("clientCnpj") clientCnpj: InputTextComponent;
    @ViewChild("insurnaceCompanyCnpj") insurnaceCompanyCnpj: InputTextComponent;
    @ViewChild("selectModality") selectModality: SelectSingleChoiceComponent;
    @ViewChild("modalityType") modalityType: InputTextComponent;
    @ViewChild("insuredAmount") insuredAmount: InputTextComponent;
    @ViewChild("coverageStartDate") coverageStartDate: InputDateComponent;
    @ViewChild("coverageEndDate") coverageEndDate: InputDateComponent;
    @ViewChild("netPremium") netPremium: InputTextComponent;
    @ViewChild("fractionalAdditional") fractionalAdditional: InputTextComponent;
    @ViewChild("policyCost") policyCost: InputTextComponent;
    @ViewChild("iof") iof: InputTextComponent;
    @ViewChild("totalPremium") totalPremium: InputTextComponent;
    @ViewChild("installmentPlan") installmentPlan: InputTextComponent;
    @ViewChild("installmentValue") installmentValue: InputTextComponent;
    @ViewChild("dueDate") dueDate: InputDateComponent;

    protected saveInsuredFormComponent = SaveInsuredFormComponent;
    protected saveClientFormComponent = SaveClientFormComponent;
    protected saveInsuranceCompanyFormComponent = SaveInsuranceCompanyFormComponent;

    constructor(
        private readonly pageService: PageService,
        private readonly router: Router,
        private readonly adminPolicyService: AdminPolicyService,
        private readonly spinner: NgxSpinnerService,
        private readonly notifier: NotificationService,
        private readonly authService: AuthService,
        private readonly adminInsuranceCompanyService: AdminInsuranceCompanyService,
        private readonly clientInsuranceCompanyService: ClientInsuranceCompanyService,
        private readonly clientInsured: ClientInsuredService,
        private readonly adminClientService: AdminClientService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadClientsAsAutocompleteSuggestions();
        this.loadInsuranceCompaniesAsAutocompleteSuggestions();
        this.loadInsuredsAsAutocompleteSuggestions();
    }

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.ADMIN.CLIENT.ROOT(), "Apólices", "Apólices"),
            new PageRoute(this.URLS.PATHS.ADMIN.CLIENT.CREATE(), "Cadastrar apólice", "Cadastrar"),
        ];
    }

    protected override onSubmit(): void {
        if (!this.isFormValid()) {
            return;
        }

        const formDto: InsurancePolicyFormDto = {
            processNumber: this.processNumber.getValue(),
            policyNumber: this.policyNumber.getValue(),
            insuranceBranch: this.insuranceBranch.getValue(),
            proposalNumber: this.proposalNumber.getValue(),
            insuredId: this.insuredSelected.id,
            clientId: this.clientSelected.id,
            insuranceCompanyId: this.insuranceCompanySelected.id,
            susepCode: "05886",
            insuredAmount: this.parseCurrency(this.insuredAmount.getValue()),
            modality: this.selectModality.getSelectedValue(),
            modalityType: this.modalityType.getValue(),
            coverageStartDate: this.coverageStartDate.getSelectedDate(),
            coverageEndDate: this.coverageEndDate.getSelectedDate(),
            netPremium: this.parseCurrency(this.netPremium.getValue()),
            fractionalAdditional: this.parseCurrency(this.fractionalAdditional.getValue()),
            policyCost: this.parseCurrency(this.policyCost.getValue()),
            iof: this.parseCurrency(this.iof.getValue()),
            totalPremium: this.parseCurrency(this.totalPremium.getValue()),
            installmentPlan: this.installmentPlan.getValue(),
            installmentValue: this.parseCurrency(this.installmentValue.getValue()),
            dueDate: this.dueDate.getSelectedDate(),
        };

        this.spinner.show();
        this.adminPolicyService.createPolicy(formDto).subscribe({
            next: (response) => {
                this.notifier.showSuccess("Apólice cadastrada com sucesso.");

                if (this.authService.isAdmin()) {
                    this.router.navigate([this.URLS.PATHS.ADMIN.POLICY.ROOT()]);
                } else {
                    this.router.navigate([this.URLS.PATHS.CLIENT.POLICY.ROOT()]);
                }

                this.spinner.hide();
            },
            error: (error) => {
                this.notifier.showError("Erro ao cadastrar apólice: " + error.message);
                this.spinner.hide();
            },
        });
    }

    protected override isFormValid(): boolean {
        if (this.clientSelected == null || this.insuredSelected == null || this.insuranceCompanySelected == null) {
            this.notifier.showError("Por favor, selecione um tomador, segurado e uma seguradora válidos.");
            return false;
        }

        let isValid = true;
        isValid = this.processNumber.validate() && isValid;
        isValid = this.policyNumber.validate() && isValid;
        isValid = this.insuranceBranch.validate() && isValid;
        isValid = this.proposalNumber.validate() && isValid;
        isValid = this.insuredAmount.validate() && isValid;
        isValid = this.selectModality.validate() && isValid;
        isValid = this.modalityType.validate() && isValid;
        isValid = this.coverageStartDate.validate() && isValid;
        isValid = this.coverageEndDate.validate() && isValid;
        isValid = this.netPremium.validate() && isValid;
        isValid = this.fractionalAdditional.validate() && isValid;
        isValid = this.policyCost.validate() && isValid;
        isValid = this.iof.validate() && isValid;
        isValid = this.totalPremium.validate() && isValid;
        isValid = this.installmentPlan.validate() && isValid;
        isValid = this.installmentValue.validate() && isValid;
        isValid = this.dueDate.validate() && isValid;
        return isValid;
    }

    protected onCancel(): void {
        this.router.navigate([this.URLS.PATHS.ADMIN.POLICY.ROOT()]);
    }

    onInsuredSelected(suggestionId: any): void {
        if (suggestionId) {
            this.insuredSelected = this.insureds.find((e) => e.id === suggestionId);
        } else {
            this.insuredSelected = null;
        }
    }

    onClientSelected(suggestionId: any): void {
        if (suggestionId) {
            this.clientSelected = this.clients.find((e) => e.id === Number(suggestionId));
        } else {
            this.clientSelected = null;
        }
    }

    onInsuranceCompanySelected(suggestionId: any): void {
        if (suggestionId) {
            this.insuranceCompanySelected = this.insuranceCompanies.find((e) => e.id === Number(suggestionId));
        } else {
            this.insuranceCompanySelected = null;
        }
    }

    protected loadInsuranceCompaniesAsAutocompleteSuggestions(): void {
        const service = this.authService.isAdmin() ? this.adminInsuranceCompanyService : this.clientInsuranceCompanyService;

        service.findAll().subscribe({
            next: (companies) => {
                this.insuranceCompanies = companies;

                this.autocompleteInsuranceCompanySuggestions = companies.map((company) => ({
                    id: company.id.toString(),
                    value: company.id.toString(),
                    text: `${company.insuranceCompanyName} | ${company.cnpj}`,
                }));
            },
            error: (err) => {
                this.notifier.showError("Erro ao buscar seguradoras");
                console.error(err);
            },
        });
    }

    protected loadInsuredsAsAutocompleteSuggestions(): void {
        this.clientInsured.getInsureds().subscribe({
            next: (insureds) => {
                this.autocompleteInsuredSuggestions = insureds.map((insured) => ({
                    id: insured.id,
                    value: insured.id.toString(),
                    text: `${insured.name} | ${insured.document}`,
                }));
                this.insureds = insureds;
            },
            error: (err) => {
                this.notifier.showError("Erro ao buscar segurados");
                console.error(err);
            },
        });
    }

    protected loadClientsAsAutocompleteSuggestions(): void {
        this.adminClientService.findAllClients().subscribe({
            next: (clients) => {
                this.autocompleteClientSuggestions = clients.map((client) => ({
                    id: client.id.toString(),
                    text: `${client.companyName} | ${client.cnpj}`,
                }));

                this.clients = clients;
            },
            error: (err) => {
                this.notifier.showError("Erro ao buscar tomadores");
                console.error(err);
            },
        });
    }
}
