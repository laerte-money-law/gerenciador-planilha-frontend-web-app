import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {SpreadSheetService} from "src/app/admin/services/spreadsheet.service";
import {
    SelectOption,
    SelectSingleChoiceComponent
} from "../../../../shared/views/components/atoms/select-single-choice/select-single-choice.component";
import {NotificationService} from "../../../../shared/services/notification.service";
import {BaseFormView} from "../../../../shared/views/base-form.view";

@Component({
    selector: "app-spreadsheet-delete-column-modal",
    templateUrl: "./spreadsheet-delete-column-modal.html",
})
export class SpreadsheetDeleteColumnModal extends BaseFormView implements OnInit {
    @Input() spreadsheetId!: string;
    @ViewChild("selectColumnToDelete") selectColumnToDelete: SelectSingleChoiceComponent;

    columnsToDelete: SelectOption[] = []

    constructor(
        public activeModal: NgbActiveModal,
        private spreadsheetService: SpreadSheetService,
        private notificationService: NotificationService,
    ) {
        super()
    }

    ngOnInit(): void {
        this.loadColumnsOptions()
    }

    override onSubmit(): void {
        if (this.isFormValid()) {
            this.spreadsheetService
                .deleteColumn(this.spreadsheetId, {columnName: this.selectColumnToDelete.getSelectedValue()})
                .subscribe({
                    next: () => {
                        this.notificationService.showSuccess("Coluna deletada com sucesso!");
                        this.activeModal.close({success: true});
                    },
                    error: (error) => {
                        console.error("Erro ao deletar coluna", error);
                        this.notificationService.showError("Erro ao deletar coluna");
                    },
                });
        } else {
            this.notificationService.showError("Selecione uma coluna para deletar");
        }

    }


    cancel(): void {
        this.activeModal.dismiss();
    }

    override isFormValid(): boolean {
        return this.selectColumnToDelete.getSelectedValue() !=  null;
    }

    private loadColumnsOptions(): void {
        this.spreadsheetService.getSpreadsheetColumns(this.spreadsheetId)
            .subscribe({
                next: (spreadSheetInfo: any) => {
                    this.columnsToDelete = spreadSheetInfo.columns.map(column => {
                        return {
                            value: column,
                            text: column
                        }
                    });
                },
                error: (error) => {
                    console.error("Erro ao deletar coluna", error);
                    this.notificationService.showError("Erro ao carregar colunas para exclusão");
                }
            })
    }
}

