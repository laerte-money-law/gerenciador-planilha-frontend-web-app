import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseValidator } from "src/app/shared/validators/base.validator";
import { CnpjValidator } from "src/app/shared/validators/cnpj.validator";
import { BaseFormView, FormStateEnum } from "src/app/shared/views/base-form.view";
import { NameInputTextModifier } from "../../../atoms/input-text/input-text-modifiers";
import { InputTextComponent } from "../../../atoms/input-text/input-text.component";
import { NotificationService } from "src/app/shared/services/notification.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AdminClientService } from "src/app/admin/services/admin-client.service";
import { AdminClientSaveFormDto } from "src/app/admin/models/forms/admin-client-save.form.dto";
import { ReceitaService } from "src/app/admin/services/admin-cnpj-receita.service";
import { InputAutocompleteGooglemapsComponent } from "../../../atoms/input-autocomplete-googlemaps/input-autocomplete-googlemaps.component";

@Component({
    selector: "app-save-insured-form",
    templateUrl: "./save-client.form.component.html",
})
export class SaveClientFormComponent extends BaseFormView implements OnInit {
    @ViewChild("inputCompanyName") inputCompanyName: InputTextComponent;
    @ViewChild("inputCnpj") inputCnpj: InputTextComponent;
    @ViewChild("inputStreet") inputStreet!: InputTextComponent;
    @ViewChild("inputNeighborhood") inputNeighborhood!: InputTextComponent;
    @ViewChild("inputCity") inputCity!: InputTextComponent;
    @ViewChild("inputState") inputState!: InputTextComponent;
    @ViewChild("inputCepAutocomplete") inputCepAutocomplete!: InputAutocompleteGooglemapsComponent;

    CEP_MASK = BaseValidator.MASKS.CEP;
    CNPJ_MASK = BaseValidator.MASKS.CNPJ;
    cnpjValidator: CnpjValidator = new CnpjValidator();
    nameInputTextModifier = new NameInputTextModifier();

    constructor(
        public activeModal: NgbActiveModal,
        private readonly notifier: NotificationService,
        private readonly adminClientService: AdminClientService,
        private readonly receitaService: ReceitaService
    ) {
        super();
    }

    ngOnInit(): void {
        console.log("SaveClientFormComponent");
    }

    ngAfterViewInit(): void {
        this.inputCnpj.registerOnChange((value: string) => {
            const sanitizedCnpj = value?.replace(/\D/g, "");
            if (this.cnpjValidator.isValid(sanitizedCnpj)) {
                this.getInfoFromCNPJAndFillFields(sanitizedCnpj);
            }
        });
    }

    protected override onSubmit(): void {
        if (this.isFormValid()) {
            this.formState = FormStateEnum.SUBMITION_LOADING;

            const dto = this.extractDtoFromForm();

            this.adminClientService.saveClient(dto, null).subscribe({
                next: (response) => {
                    this.formState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
                    this.notifier.showSuccess("Solicitação enviada com sucesso!");
                    this.activeModal.close(dto);
                },
                error: (e) => {
                    this.formState = FormStateEnum.SUBMITION_FAILED;
                    throw e;
                },
            });
        }
    }

    extractDtoFromForm(): AdminClientSaveFormDto {
        return {
            companyName: this.inputCompanyName.getValue(),
            cnpj: this.inputCnpj.getValue(),
            address: this.inputStreet.getValue(),
            city: this.inputCity.getValue(),
            state: this.inputState.getValue(),
            cep: this.inputCepAutocomplete.getValue().postalCode ?? "",
            neighborhood: this.inputNeighborhood.getValue(),
            contactName: "",
            contactPhone: "",
            contactEmail: "",
            subsidiaries: [],
        };
    }

    private getInfoFromCNPJAndFillFields(cnpj: string): void {
        this.receitaService.getDataByCNPJ(cnpj).subscribe({
            next: (data) => {
                this.inputCompanyName.changeValue(data.nome ?? "");
                this.inputStreet.changeValue(data.logradouro ?? "");
                this.inputNeighborhood.changeValue(data.bairro ?? "");
                this.inputCity.changeValue(data.municipio ?? "");
                this.inputState.changeValue(data.uf ?? "");
                this.inputCepAutocomplete.setValue({ postalCode: data.cep });
            },
            error: () => {
                console.log("Erro ao buscar dados do CNPJ na Receita Federal.");
            },
        });
    }

    protected override isFormValid(): boolean {
        console.log("TODO: Validating form...");
        return true;
    }
}
