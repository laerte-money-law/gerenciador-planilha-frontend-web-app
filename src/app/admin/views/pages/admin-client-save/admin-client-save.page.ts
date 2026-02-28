import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseAppPageFormView } from "../../../../shared/views/base-app-page-form.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { ActivatedRoute, Router } from "@angular/router";
import { PageService } from "../../../../shared/services/page.service";
import { BaseValidator } from "../../../../shared/validators/base.validator";
import { CnpjValidator } from "./../../../../shared/validators/cnpj.validator";
import {
    LowerCaseInputTextModifier,
    NameInputTextModifier,
} from "../../../../shared/views/components/atoms/input-text/input-text-modifiers";
import { EmailValidator } from "../../../../shared/validators/email.validator";
import { FormStateEnum } from "../../../../shared/views/base-form.view";
import { NotificationService } from "../../../../shared/services/notification.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AdminClientSaveFormDto } from "../../../models/forms/admin-client-save.form.dto";
import {
    Address,
    InputAutocompleteGooglemapsComponent,
} from "../../../../shared/views/components/atoms/input-autocomplete-googlemaps/input-autocomplete-googlemaps.component";
import { InputTextComponent } from "../../../../shared/views/components/atoms/input-text/input-text.component";
import { AdminClientService } from "../../../services/admin-client.service";
import { Constants } from "../../../../shared/utils/constants";
import { ClientDto } from "../../../models/client.dto";
import { ReceitaService } from "src/app/admin/services/admin-cnpj-receita.service";

@Component({
    selector: "admin-client-save-page",
    templateUrl: "./admin-client-save.page.html",
    styles: ``,
})
export class AdminClientSavePage extends BaseAppPageFormView implements OnInit {
    @ViewChild("inputCompanyName") inputCompanyName: InputTextComponent;
    @ViewChild("inputCnpj") inputCnpj: InputTextComponent;
    @ViewChild("inputStreet") inputStreet: InputTextComponent;
    @ViewChild("inputNumber") inputNumber: InputTextComponent;
    @ViewChild("inputNeighborhood") inputNeighborhood: InputTextComponent;
    @ViewChild("inputCity") inputCity: InputTextComponent;
    @ViewChild("inputState") inputState: InputTextComponent;
    @ViewChild("inputCepAutocomplete") inputCepAutocomplete: InputAutocompleteGooglemapsComponent;

    @ViewChild("inputContactName") inputContactName: InputTextComponent;
    @ViewChild("inputContactPhone") inputContactPhone: InputTextComponent;
    @ViewChild("inputContactEmail") inputContactEmail: InputTextComponent;

    editRecord: ClientDto;
    CNPJ_MASK = BaseValidator.MASKS.CNPJ;
    PHONE_MASK = BaseValidator.MASKS.PHONE;
    CEP_MASK = BaseValidator.MASKS.CEP;
    cnpjValidator: CnpjValidator = new CnpjValidator();
    emailInputTextValidator = new EmailValidator();
    nameInputTextModifier = new NameInputTextModifier();
    lowerCaseInputTextModifier = new LowerCaseInputTextModifier();
    subsidiaries: { name: string; cnpj: string }[] = [];

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly pageService: PageService,
        private readonly notifier: NotificationService,
        private readonly spinner: NgxSpinnerService,
        private readonly adminClientService: AdminClientService,
        private readonly receitaService: ReceitaService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadClientInFormIfEditing();
        this.subsidiaries = [];
    }

    ngAfterViewInit(): void {
        this.inputCnpj.registerOnChange((value: string) => {
            const sanitizedCnpj = value?.replace(/\D/g, "");
            if (CnpjValidator) {
                this.getInfoFromCNPJAndFillFields(sanitizedCnpj);
            }
        });

        this.inputCepAutocomplete.addressSelected.subscribe((address: Address) => {
            this.inputStreet.changeValue(address.route ?? "");
            this.inputNumber.changeValue(address.number ?? "");
            this.inputNeighborhood.changeValue(address.neighborhood ?? "");
            this.inputCity.changeValue(address.city ?? "");
            this.inputState.changeValue(address.state ?? "");
        });
    }

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.ADMIN.CLIENT.ROOT(), "Cliente", "Cliente"),
            new PageRoute(this.URLS.PATHS.ADMIN.CLIENT.CREATE(), "Cadastrar cliente", "Cadastrar"),
        ];
    }

    protected override isFormValid(): boolean {
        let isValid = true;
        isValid = this.inputCompanyName.validate() && isValid;
        isValid = this.inputCnpj.validate() && isValid;
        isValid = this.inputStreet.validate() && isValid;
        isValid = this.inputNumber.validate() && isValid;
        isValid = this.inputNeighborhood.validate() && isValid;
        isValid = this.inputCity.validate() && isValid;
        isValid = this.inputState.validate() && isValid;
        isValid = this.inputCepAutocomplete.validate() && isValid;
        isValid = this.inputContactName.validate() && isValid;
        isValid = this.inputContactPhone.validate() && isValid;
        isValid = this.inputContactEmail.validate() && isValid;
        return isValid;
    }

    protected override onSubmit(): void {
        if (this.isFormValid()) {
            this.formState = FormStateEnum.SUBMITION_LOADING;

            const dto = this.extractDtoFromForm();

            this.spinner.show();
            this.adminClientService.saveClient(dto, this.editRecord?.code).subscribe({
                next: () => {
                    this.formState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
                    this.notifier.showSuccess("Cliente salvo com sucesso!");
                    this.router.navigate([this.URLS.PATHS.ADMIN.CLIENT.ROOT()]);
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

    private extractDtoFromForm(): AdminClientSaveFormDto {
        return {
            companyName: this.inputCompanyName.getValue(),
            cnpj: this.inputCnpj.getValue(),
            address: `${this.inputStreet.getValue()}, ${this.inputNumber.getValue()}`,
            neighborhood: this.inputNeighborhood.getValue(),
            city: this.inputCity.getValue(),
            state: this.inputState.getValue(),
            cep: this.inputCepAutocomplete.getValue()?.postalCode ?? "",
            contactName: this.inputContactName.getValue(),
            contactPhone: this.inputContactPhone.getValue(),
            contactEmail: this.inputContactEmail.getValue(),
            subsidiaries: this.subsidiaries.map((s) => ({
                companyName: s.name,
                cnpj: s.cnpj,
            })),
        };
    }

    private loadClientInFormIfEditing(): void {
        this.spinner.show();
        setTimeout(() => {
            this.route.params.subscribe((params) => {
                const code = params["code"];
                if (code) {
                    this.findClientByCode(code);
                } else {
                    this.spinner.hide();
                }
            });
        }, Constants.DEFAULT_APP_TIMEOUT);
    }

    private findClientByCode(code: string): void {
        this.adminClientService.findByCode(code).subscribe({
            next: (response) => {
                this.editRecord = response;
                this.fillFormWithEditRecord();
                this.spinner.hide();
            },
            error: () => {
                this.router.navigate([this.URLS.PATHS.ADMIN.CLIENT.ROOT()]);
            },
        });
    }

    private fillFormWithEditRecord(): void {
        const [route, number] = this.editRecord.address?.split(",") ?? ["", ""];

        this.inputCompanyName.changeValue(this.editRecord.companyName);
        this.inputCnpj.changeValue(this.formatDocument(this.editRecord.cnpj, "CNPJ"));
        this.inputStreet.changeValue(route.trim());
        this.inputNumber.changeValue(number?.trim() ?? "");
        this.inputNeighborhood.changeValue(this.editRecord.neighborhood ?? "");
        this.inputCity.changeValue(this.editRecord.city ?? "");
        this.inputState.changeValue(this.editRecord.state ?? "");
        this.inputCepAutocomplete.setValue({
            postalCode: this.editRecord.cep,
            formatted: this.editRecord.cep, // evita formatação automática incorreta
        });

        this.inputContactName.changeValue(this.editRecord.contactName);
        this.inputContactPhone.changeValue(this.formatPhone(this.editRecord.contactPhone));
        this.inputContactEmail.changeValue(this.editRecord.contactEmail);

        this.subsidiaries = this.editRecord.subsidiaries.map((s) => ({
            name: s.companyName,
            cnpj: this.formatDocument(s.cnpj, "CNPJ"),
        }));
    }

    private getInfoFromCNPJAndFillFields(cnpj: string): void {
        this.receitaService.getDataByCNPJ(cnpj).subscribe({
            next: (data) => {
                this.inputCompanyName.changeValue(data.nome);
                this.inputContactPhone.changeValue(data.telefone);
                this.inputContactEmail.changeValue(data.email);
                this.inputContactName.changeValue(data.nomeSocios[0]?.nome ?? "");

                this.inputStreet.changeValue(data.logradouro ?? "");
                this.inputNumber.changeValue(data.numero ?? "");
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

}
