import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseAppPageFormView } from "../../../../shared/views/base-app-page-form.view";
import { CnpjValidator } from "../../../../shared/validators/cnpj.validator";
import { getStatusEnumLabel, StatusEnum } from "../../../../shared/models/enums/status.enum";
import { getYesNoEnumLabel, YesNoEnum } from "../../../../shared/models/enums/yes-no.enum";
import { Router } from "@angular/router";
import { FormStateEnum } from "../../../../shared/views/base-form.view";
import { NgxSpinnerService } from "ngx-spinner";
import { AdminConsultantService } from "../../../services/admin-consultant.service";
import { AdminConsultantSaveFormDto } from "../../../models/forms/admin-consultant-save.form.dto";
import { NotificationService } from "../../../../shared/services/notification.service";
import { BaseValidator } from "../../../../shared/validators/base.validator";
import { EmailValidator } from "../../../../shared/validators/email.validator";
import {
    InputRadiogroupComponent,
    InputOption,
} from "../../../../shared/views/components/atoms/input-radiogroup/input-radiogroup.component";
import {
    NameInputTextModifier,
    LowerCaseInputTextModifier,
} from "../../../../shared/views/components/atoms/input-text/input-text-modifiers";
import { InputTextComponent } from "../../../../shared/views/components/atoms/input-text/input-text.component";
import { PageService } from "../../../../shared/services/page.service";
import { PageRoute } from "../../../../shared/models/page-route";

@Component({
    selector: "admin-broker-save-page",
    templateUrl: "./admin-broker-save.page.html",
    styles: ``,
})
export class AdminBrokerSavePage extends BaseAppPageFormView implements OnInit {
    @ViewChild("inputName") inputName: InputTextComponent;
    @ViewChild("inputCnpj") inputCnpj: InputTextComponent;
    @ViewChild("inputAddress") inputAddress: InputTextComponent;
    @ViewChild("inputPhone") inputPhone: InputTextComponent;
    @ViewChild("inputEmail") inputEmail: InputTextComponent;
    @ViewChild("radioStatus") radioStatus: InputRadiogroupComponent;
    @ViewChild("radioResetPasswordOnNextLogin") radioResetPasswordOnNextLogin: InputRadiogroupComponent;

    nameInputTextModifier = new NameInputTextModifier();
    emailInputTextValidator = new EmailValidator();
    lowerCaseInputTextModifier = new LowerCaseInputTextModifier();
    cnpjValidator: CnpjValidator = new CnpjValidator();
    STATUS = StatusEnum;
    CNPJ_MASK = BaseValidator.MASKS.CNPJ;
    PHONE_MASK = BaseValidator.MASKS.PHONE;
    CODIGO_SUSEP = BaseValidator.MASKS.CODIGO_SUSEP;
    statusOptions: InputOption[] = [
        {
            value: this.STATUS.ACTIVE,
            label: getStatusEnumLabel(this.STATUS.ACTIVE),
        },
        {
            value: this.STATUS.INACTIVE,
            label: getStatusEnumLabel(this.STATUS.INACTIVE),
        },
    ];
    YES_NO = YesNoEnum;
    yesNoOptions: InputOption[] = [
        {
            value: this.YES_NO.YES,
            label: getYesNoEnumLabel(this.YES_NO.YES),
        },
        {
            value: this.YES_NO.NO,
            label: getYesNoEnumLabel(this.YES_NO.NO),
        },
    ];

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.ADMIN.BROKERS.ROOT(), "Corretoras", "Corretoras"),
            new PageRoute(this.URLS.PATHS.ADMIN.BROKERS.CREATE(), "Cadastrar corretora", "Cadastrar"),
        ];
    }

    constructor(
        private readonly pageService: PageService,
        private readonly router: Router,
        private readonly spinner: NgxSpinnerService,
        private readonly notifier: NotificationService,
        private readonly adminConsultantService: AdminConsultantService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
    }

    protected override onSubmit(): void {
        if (this.isFormValid()) {
            this.formState = FormStateEnum.SUBMITION_LOADING;

            const dto = this.extractDtoFromForm();

            this.spinner.show();
            this.adminConsultantService.saveConsultant(dto, null).subscribe({
                next: (response) => {
                    this.formState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
                    this.notifier.showSuccess("Corretora salva com sucesso!");
                    this.router.navigate([this.URLS.PATHS.ADMIN.BROKERS.ROOT()]);
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

    protected override isFormValid(): boolean {
        let isValid = true;
        isValid = this.inputName.validate() && isValid;
        isValid = this.inputCnpj.validate() && isValid;
        isValid = this.inputAddress.validate() && isValid;
        isValid = this.inputPhone.validate() && isValid;
        isValid = this.inputEmail.validate() && isValid;
        isValid = this.radioStatus.validate() && isValid;
        isValid = this.radioResetPasswordOnNextLogin.validate() && isValid;
        return isValid;
    }

    protected onCancel(): void {
        this.router.navigate([this.URLS.PATHS.ADMIN.BROKERS.ROOT()]);
    }

    private extractDtoFromForm(): AdminConsultantSaveFormDto {
        return null;
    }
}
