import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseFormView, FormStateEnum } from "src/app/shared/views/base-form.view";
import { NotificationService } from "src/app/shared/services/notification.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AdminQuotationService } from "src/app/admin/services/admin-quotation.service";
import { ClientQuotationContext } from "src/app/client/models/dto/client-insurance-company-quotation.dto";
import { QuotationUpdateInfoDto } from "src/app/admin/models/quotation-update-info.dto";
import { InputTextComponent } from "../../../atoms/input-text/input-text.component";

@Component({
    selector: "app-update-premium-form",
    templateUrl: "./update-premium.form.component.html",
})
export class UpdatePremiumFormComponent extends BaseFormView implements OnInit {
    @ViewChild("premiumValue") insuredAmount: InputTextComponent;

    quotationUpdateInfo: QuotationUpdateInfoDto;

    constructor(
        public activeModal: NgbActiveModal,
        private readonly notifier: NotificationService,
        private readonly adminQuotationService: AdminQuotationService
    ) {
        super();
    }

    ngOnInit(): void {
        const context: ClientQuotationContext = this.adminQuotationService.getQuotationContext();
        this.loadQuotationUpdateInformation(context);
    }

    private loadQuotationUpdateInformation(context): void {
        this.adminQuotationService.findQuotationUpdateInformation(context.quotationCode).subscribe({
            next: (response) => {
                this.quotationUpdateInfo = response;
            },
            error: (error) => { },
        });
    }

    protected override onSubmit(): void {
        if (this.isFormValid()) {
            this.formState = FormStateEnum.SUBMITION_LOADING;
            const premiumValue = this.parseCurrency(this.insuredAmount.getValue())

            this.adminQuotationService
                .updateQuotationPremium(this.adminQuotationService.getQuotationContext().quotationCode, {
                    premiumValue: Number(premiumValue),
                })
                .subscribe({
                    next: (response) => {
                        this.notifier.showSuccess("Prêmio atualizado com sucesso.");
                        this.formState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
                        this.activeModal.close(true);
                    },
                    error: (error) => {
                        this.formErrorMessage = error?.message ?? "Erro ao enviar atualização do prêmio"
                        this.formState = FormStateEnum.SUBMITION_FAILED;
                    },
                });
        }
    }

    protected override isFormValid(): boolean {
        return this.insuredAmount.isValid();
    }
}
