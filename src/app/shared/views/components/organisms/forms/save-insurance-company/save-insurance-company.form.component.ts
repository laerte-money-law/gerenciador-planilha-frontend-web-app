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
import { AdminInsuranceCompanyService } from "src/app/admin/services/admin-insurance-company.service";
import { AdminInsuranceCompanytCreateFormDto } from "src/app/admin/models/forms/admin-insurance-company-save.form.dto";

@Component({
    selector: "app-save-insurance-company-form",
    templateUrl: "./save-insurance-company.form.component.html",
})
export class SaveInsuranceCompanyFormComponent extends BaseFormView implements OnInit {
    @ViewChild("inputCompanyName") inputCompanyName: InputTextComponent;
    @ViewChild("inputCnpj") inputCnpj: InputTextComponent;

    CNPJ_MASK = BaseValidator.MASKS.CNPJ;
    cnpjValidator: CnpjValidator = new CnpjValidator();
    nameInputTextModifier = new NameInputTextModifier();

    constructor(
        public activeModal: NgbActiveModal,
        private readonly notifier: NotificationService,
        private readonly adminInsuranceCompanyService: AdminInsuranceCompanyService,
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
            this.adminInsuranceCompanyService.create(dto).subscribe({
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

    extractDtoFromForm(): AdminInsuranceCompanytCreateFormDto {
        return {
            insuranceCompanyName: this.inputCompanyName.getValue(),
            cnpj: this.inputCnpj.getValue(),
            registrationCode: "",
            status: "INACTIVE",
            address: "aa",
            neighborhood: "aa",
            city: "aa",
            state: "aa",
            cep: "aa",
        };
    }

    private getInfoFromCNPJAndFillFields(cnpj: string): void {
        this.receitaService.getDataByCNPJ(cnpj).subscribe({
            next: (data) => {
                this.inputCompanyName.changeValue(data.nome);
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
