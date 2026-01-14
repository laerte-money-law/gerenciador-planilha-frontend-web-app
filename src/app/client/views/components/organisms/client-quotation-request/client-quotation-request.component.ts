import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "../../../../../shared/services/notification.service";
import { BaseValidator } from "../../../../../shared/validators/base.validator";
import { CnpjValidator } from "../../../../../shared/validators/cnpj.validator";
import { CpfValidator } from "../../../../../shared/validators/cpf.validator";
import { EmailValidator } from "../../../../../shared/validators/email.validator";
import { NameValidator } from "../../../../../shared/validators/name.validator";
import { BaseFormView, FormStateEnum } from "../../../../../shared/views/base-form.view";
import {
    Address,
    InputAutocompleteGooglemapsComponent,
} from "../../../../../shared/views/components/atoms/input-autocomplete-googlemaps/input-autocomplete-googlemaps.component";
import { LowerCaseInputTextModifier } from "../../../../../shared/views/components/atoms/input-text/input-text-modifiers";
import { InputTextComponent } from "../../../../../shared/views/components/atoms/input-text/input-text.component";
import { ClientQuotationRequestFormDto } from "../../../../models/forms/client-quotation-request.form.dto";
import { ClientInsuranceCompanyService } from "../../../../services/client-insurance-company.service";
import { ClientQuotationService } from "../../../../services/client-quotation.service";
import {
    SelectOption,
    SelectSingleChoiceComponent,
} from "../../../../../shared/views/components/atoms/select-single-choice/select-single-choice.component";
import { AppealType } from "../../../../models/enums/appeal-type.enum";
import { InputDateComponent } from "../../../../../shared/views/components/atoms/input-date/input-date.component";
import { AuthService } from "src/app/auth/services/auth.service";
import { Suggestion } from "src/app/shared/views/components/atoms/input-autocomplete-single-choice/input-autocomplete-single-choice.component";

@Component({
    selector: "app-client-quotation-request",
    templateUrl: "./client-quotation-request.component.html",
    styles: ``,
})
export class ClientQuotationRequestComponent extends BaseFormView implements OnInit, AfterViewInit {
    @Input("clientCode") clientCode: string;
    @ViewChildren("inputInsuredAmount") inputInsuredAmounts!: QueryList<InputTextComponent>;
    @ViewChildren("selectAppealType") selectAppealTypes!: QueryList<SelectSingleChoiceComponent>;
    @ViewChildren("inputPolicyStartDate") inputPolicyStartDates!: QueryList<InputDateComponent>;
    @ViewChildren("selectPolicyDuration") selectPolicyDurations!: QueryList<SelectSingleChoiceComponent>;
    // ONLY FOR ADMIN USER
    @ViewChildren("inputTax") inputTax: QueryList<InputTextComponent>;

    @ViewChild("inputCaseNumber") inputCaseNumber: InputTextComponent;
    @ViewChild("inputCourt") inputCourt: InputTextComponent;
    @ViewChild("inputInsuredName") inputInsuredName: InputTextComponent;
    @ViewChild("inputInsuredDocument") inputInsuredDocument: InputTextComponent;
    @ViewChild("inputInsuredPhone") inputInsuredPhone: InputTextComponent;
    @ViewChild("inputInsuredEmail") inputInsuredEmail: InputTextComponent;

    @ViewChild("inputStreet") inputStreet: InputTextComponent;
    @ViewChild("inputNumber") inputNumber: InputTextComponent;
    @ViewChild("inputNeighborhood") inputNeighborhood: InputTextComponent;
    @ViewChild("inputCity") inputCity: InputTextComponent;
    @ViewChild("inputState") inputState: InputTextComponent;
    @ViewChild("inputCepAutocomplete") inputCepAutocomplete: InputAutocompleteGooglemapsComponent;

    autocompleteCourtNameSuggestions: Suggestion[] = [];

    insuranceCompaniesTableForm: {
        insuranceCompanyCode: string;
        insuranceCompanyName: string;
        creditLimit: number;
        annualInterest?: number;
        startDate: Date;
        duration: number;
    }[];

    appealTypeSelectOptions: SelectOption[] = AppealType.toList().map((e): SelectOption => {
        return { value: e.key, text: e.text };
    });

    policyDurationSelectOptions: SelectOption[] = [
        {
            value: "3",
            text: "3 anos",
        },
        {
            value: "4",
            text: "4 anos",
        },
        {
            value: "5",
            text: "5 anos",
        },
    ];
    emailInputTextValidator = new EmailValidator();
    nameInputTextValidator = new NameValidator("Por favor informe pelo menos um Nome e Sobrenome com pelo menos 3 letras em cada um.");
    lowerCaseInputTextModifier = new LowerCaseInputTextModifier();
    PHONE_MASK = BaseValidator.MASKS.PHONE;
    CPF_CNPJ_MASK = `${BaseValidator.MASKS.CPF}||${BaseValidator.MASKS.CNPJ}`;
    cnpjValidator: CnpjValidator = new CnpjValidator();
    cpfValidator: CpfValidator = new CpfValidator();
    CEP_MASK = BaseValidator.MASKS.CEP;
    PROCESS_NUMBER_MASK = BaseValidator.MASKS.NUMERO_PROCESSO;

    constructor(
        private readonly clientInsuranceCompanyService: ClientInsuranceCompanyService,
        private readonly clientQuotationService: ClientQuotationService,
        private readonly router: Router,
        private readonly spinner: NgxSpinnerService,
        private readonly notifier: NotificationService,
        private readonly authService: AuthService
    ) {
        super();
    }
    ngAfterViewInit(): void {
        this.loadDataFormIfExists();

        this.inputCaseNumber.registerOnChange((value: string) => {
            if (this.isValidProcessNumber(value)) {
                console.log("QASDAJDIOPSAJDO");
                this.loadCourtNames(value);
            }
        });
    }

    ngOnInit(): void {
        this.loadInsuranceCompaniesOnTable();
    }

    public get isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    public loadCourtNames(processNumber: string): void {
        this.clientQuotationService.getCourtNames(processNumber).subscribe({
            next: (courtNames) => {
                if (courtNames.length > 0) {
                    console.log("Tribunais encontrados:", courtNames);
                    this.autocompleteCourtNameSuggestions = courtNames.map((name) => ({ value: name, text: name }));
                }
            },
            error: (error) => {
                console.error("Erro ao carregar os tribunais:", error);
                this.notifier.showError("Erro ao carregar os tribunais. Tente novamente mais tarde.");
            },
        });
    }

    onSelectCourtName(value) {
        console.log("Tribunal selecionado:", value);
    }

    getTableFormDuration(insuranceCompanyCode: string): number {
        return this.insuranceCompaniesTableForm.find((item) => item.insuranceCompanyCode === insuranceCompanyCode).duration;
    }

    replicateInsuranceCompanyTableFormToAll(insuranceCompanyCode: string): void {
        const insuredAmount = this.parseCurrency(
            this.inputInsuredAmounts.find((e) => e.fieldName.toLowerCase().contains(insuranceCompanyCode.toLowerCase())).getValue()
        );

        const appealType = this.selectAppealTypes
            .find((e) => e.fieldName.toLowerCase().contains(insuranceCompanyCode.toLowerCase()))
            .getSelectedValue();
        const startDate = this.inputPolicyStartDates
            .find((e) => e.fieldName.toLowerCase().contains(insuranceCompanyCode.toLowerCase()))
            .getSelectedDate();
        const duration = this.selectPolicyDurations
            .find((e) => e.fieldName.toLowerCase().contains(insuranceCompanyCode.toLowerCase()))
            .getSelectedValue();

        this.inputInsuredAmounts.forEach((e) => e.changeValue(this.formatCurrency(insuredAmount)));
        this.selectAppealTypes.forEach((e) => e.setValue(appealType));
        this.inputPolicyStartDates.forEach((e) => e.changeDate(startDate));
        this.selectPolicyDurations.forEach((e) => e.setValue(duration));

        if (this.isAdmin) {
            const tax = this.inputTax.find((e) => e.fieldName.toLowerCase().contains(insuranceCompanyCode.toLowerCase())).getValue();
            this.inputTax.forEach((e) => e.changeValue(tax));
        }
    }

    addThirtyPercent(): void {
        console.log("Adding 30% to all insured amounts");
        this.inputInsuredAmounts.forEach((input) => {
            const currentValue = this.parseCurrency(input.getValue());
            const newValue = currentValue + currentValue * 0.3; // Add 30%
            input.changeValue(this.formatCurrency(newValue));
        });
        this.notifier.showSuccess("30% adicionados aos valores segurados.");
    }

    override onSubmit(): void {
        if (this.isFormValid()) {
            this.formState = FormStateEnum.SUBMITION_LOADING;

            const dto = this.extractDtoFromForm();

            this.spinner.show();
            this.clientQuotationService.sendQuotationRequest(dto).subscribe({
                next: (response) => {
                    this.formState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
                    this.notifier.showSuccess("Solicitações enviadas com sucesso!");

                    if (this.authService.isAdmin()) {
                        this.router.navigate([this.URLS.PATHS.ADMIN.QUOTATIONS.ROOT()]);
                    } else {
                        this.router.navigate([this.URLS.PATHS.CLIENT.QUOTATIONS.ROOT()]);
                    }

                    this.spinner.hide();
                },
                error: (e) => {
                    this.formState = FormStateEnum.SUBMITION_FAILED;
                    this.spinner.hide();
                    throw e;
                },
            });
        } else {
            this.formState = FormStateEnum.SUBMITION_FAILED;
            this.notifier.showError(this.ERROR_MESSAGES.FORM_HAS_ERRORS());
        }
    }

    override isFormValid(): boolean {
        let isValid = true;

        this.inputInsuredAmounts.forEach((e) => {
            isValid = e.validate() && isValid;
        });
        this.selectAppealTypes.forEach((e) => {
            isValid = e.validate() && isValid;
        });
        this.inputPolicyStartDates.forEach((e) => {
            isValid = e.validate() && isValid;
        });
        this.selectPolicyDurations.forEach((e) => {
            isValid = e.validate() && isValid;
        });

        isValid = this.inputCaseNumber.validate() && isValid;
        isValid = this.inputCourt.validate() && isValid;
        isValid = this.inputInsuredName.validate() && isValid;
        isValid = this.inputInsuredDocument.validate() && isValid;
        isValid = this.inputInsuredPhone.validate() && isValid;
        isValid = this.inputInsuredEmail.validate() && isValid;
        isValid = this.inputStreet.validate() && isValid;
        isValid = this.inputNumber.validate() && isValid;
        isValid = this.inputNeighborhood.validate() && isValid;
        isValid = this.inputCity.validate() && isValid;
        isValid = this.inputState.validate() && isValid;
        isValid = this.inputCepAutocomplete.validate() && isValid;

        return isValid;
    }

    private extractDtoFromForm(): ClientQuotationRequestFormDto {
        return {
            caseNumber: this.inputCaseNumber.getValue(),
            court: (this.inputCourt.getValue() as any).text,
            insuredName: this.inputInsuredName.getValue(),
            insuredDocument: this.inputInsuredDocument.getValue(),
            insuredAddressRoute: this.inputStreet.getValue(),
            insuredAddressNumber: this.inputNumber.getValue(),
            insuredAddressNeighborhood: this.inputNeighborhood.getValue(),
            insuredAddressCity: this.inputCity.getValue(),
            insuredAddressState: this.inputState.getValue(),
            insuredAddressZipCode: this.inputCepAutocomplete.getValue().postalCode ?? "",
            insuredPhone: this.inputInsuredPhone.getValue(),
            insuredEmail: this.inputInsuredEmail.getValue(),
            insuranceCompanies: this.insuranceCompaniesTableForm.map((item) => ({
                insuranceCompanyRegistrationCode: item.insuranceCompanyCode,
                insuredAmount: this.parseCurrency(
                    this.inputInsuredAmounts
                        .find((e) => e.fieldName.toLowerCase().contains(item.insuranceCompanyCode.toLowerCase()))
                        .getValue()
                ),
                appealType: this.selectAppealTypes
                    .find((e) => e.fieldName.toLowerCase().contains(item.insuranceCompanyCode.toLowerCase()))
                    .getSelectedValue(),
                startDate: this.inputPolicyStartDates
                    .find((e) => e.fieldName.toLowerCase().contains(item.insuranceCompanyCode.toLowerCase()))
                    .getSelectedDate(),
                duration: this.selectPolicyDurations
                    .find((e) => e.fieldName.toLowerCase().contains(item.insuranceCompanyCode.toLowerCase()))
                    .getSelectedValue()
                    .parseInt(),
                tax: this.isAdmin
                    ? Number(
                          this.inputTax
                              .find((e) => e?.fieldName?.toLowerCase()?.includes(item.insuranceCompanyCode?.toLowerCase() ?? ""))
                              ?.getValue() ?? 0
                      )
                    : null,
            })),
            clientCodes: [this.clientInsuranceCompanyService.getClientCode()],
        };
    }

    private loadInsuranceCompaniesOnTable(): void {
        const insuranceCompanies = this.clientInsuranceCompanyService.getInsuranceCompaniesSelected();
        if (insuranceCompanies.isEmtpy()) {
            this.router.navigate([this.URLS.PATHS.CLIENT.INSURANCE_COMPANY.REGISTRATION()]);
        }
        this.insuranceCompaniesTableForm = insuranceCompanies.map((item) => {
            return {
                insuranceCompanyCode: item.insuranceCompanyRegistrationCode,
                insuranceCompanyName: item.insuranceCompanyName,
                creditLimit: item.creditLimit,
                anualInterest: item.annualInterest,
                startDate: new Date(),
                duration: 3,
            };
        });
    }

    private loadDataFormIfExists(): void {
        const depositGuide = this.clientInsuranceCompanyService.getDepositGuide();

        if (depositGuide) {
            this.inputInsuredName.changeValue(depositGuide.author);
            this.inputInsuredDocument.changeValue(depositGuide.authorDocument);
            this.inputCaseNumber.changeValue(depositGuide.processNumber);
            this.inputCourt.changeValue(depositGuide.courtName);

            this.inputInsuredAmounts.forEach((input) => {
                input.changeValue(this.formatCurrency(depositGuide.value));
            });
        }

        this.inputCepAutocomplete.addressSelected.subscribe((address: Address) => {
            this.inputStreet.changeValue(address.route ?? "");
            this.inputNumber.changeValue(address.number ?? "");
            this.inputNeighborhood.changeValue(address.neighborhood ?? "");
            this.inputCity.changeValue(address.city ?? "");
            this.inputState.changeValue(address.state ?? "");
        });
    }
}
