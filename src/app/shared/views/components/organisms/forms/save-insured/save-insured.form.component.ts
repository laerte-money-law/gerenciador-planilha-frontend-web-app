import { Component, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseValidator } from "src/app/shared/validators/base.validator";
import { CnpjValidator } from "src/app/shared/validators/cnpj.validator";
import { CpfValidator } from "src/app/shared/validators/cpf.validator";
import { NameValidator } from "src/app/shared/validators/name.validator";
import { EmailValidator } from "src/app/shared/validators/email.validator";
import { BaseFormView, FormStateEnum } from "src/app/shared/views/base-form.view";
import { InputTextComponent } from "../../../atoms/input-text/input-text.component";
import { InputAutocompleteGooglemapsComponent } from "../../../atoms/input-autocomplete-googlemaps/input-autocomplete-googlemaps.component";
import { LowerCaseInputTextModifier } from "../../../atoms/input-text/input-text-modifiers";
import { ClientInsuredService } from "src/app/client/services/client-insured.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { InsuredSaveInputDto } from "src/app/client/models/dto/insured-save-input.dto";

@Component({
    selector: "app-save-insured-form",
    templateUrl: "./save-insured.form.component.html",
})
export class SaveInsuredFormComponent extends BaseFormView {
    @ViewChild("inputInsuredName") inputInsuredName!: InputTextComponent;
    @ViewChild("inputInsuredDocument") inputInsuredDocument!: InputTextComponent;
    @ViewChild("inputInsuredPhone") inputInsuredPhone!: InputTextComponent;
    @ViewChild("inputInsuredEmail") inputInsuredEmail!: InputTextComponent;
    @ViewChild("inputStreet") inputStreet!: InputTextComponent;
    @ViewChild("inputNumber") inputNumber!: InputTextComponent;
    @ViewChild("inputNeighborhood") inputNeighborhood!: InputTextComponent;
    @ViewChild("inputCity") inputCity!: InputTextComponent;
    @ViewChild("inputState") inputState!: InputTextComponent;
    @ViewChild("inputCepAutocomplete") inputCepAutocomplete!: InputAutocompleteGooglemapsComponent;

    emailInputTextValidator = new EmailValidator();
    nameInputTextValidator = new NameValidator("Por favor informe pelo menos um Nome e Sobrenome com pelo menos 3 letras em cada um.");
    lowerCaseInputTextModifier = new LowerCaseInputTextModifier();
    PHONE_MASK = BaseValidator.MASKS.PHONE;
    CPF_CNPJ_MASK = `${BaseValidator.MASKS.CPF}||${BaseValidator.MASKS.CNPJ}`;
    cnpjValidator: CnpjValidator = new CnpjValidator();
    cpfValidator: CpfValidator = new CpfValidator();
    CEP_MASK = BaseValidator.MASKS.CEP;

    constructor(
        public activeModal: NgbActiveModal,
        private readonly notifier: NotificationService,
        private readonly insuredService: ClientInsuredService
    ) {
        super();
    }

    override onSubmit(): void {
        if (this.isFormValid()) {
            this.formState = FormStateEnum.SUBMITION_LOADING;

            const dto = this.extractDtoFromForm();

            this.insuredService.createInsured(dto).subscribe({
                next: (response) => {
                    this.formState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
                    this.notifier.showSuccess("Solicitações enviadas com sucesso!");
                    this.activeModal.close(dto);
                },
                error: (e) => {
                    this.formState = FormStateEnum.SUBMITION_FAILED;
                    throw e;
                },
            });
        }
    }

    private extractDtoFromForm(): InsuredSaveInputDto {
        return {
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
        };
    }

    protected override isFormValid(): boolean {
        return true; // Replace with real validation
    }
}
