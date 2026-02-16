import { Component, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SpreadSheetService } from "src/app/admin/services/spreadsheet.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-spreadsheet-add-column-modal",
  templateUrl: "./spreadsheet-add-column-modal.html",
})
export class SpreadsheetAddColumnModal {
  @Input() spreadsheetId!: string;

  form = this.fb.group({
    columnName: ["", Validators.required],
  });

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private spreadsheetService: SpreadSheetService,
    private toastr: ToastrService
  ) {}

  submit(): void {
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;

    const columnName = this.form.value.columnName;

    this.spreadsheetService
      .addColumn(this.spreadsheetId, { columnName })
      .subscribe({
        next: () => {
          this.toastr.success("Coluna adicionada com sucesso!");
          this.activeModal.close({ success: true });
        },
        error: (error) => {
          console.error("Erro ao adicionar coluna", error);
          this.toastr.error("Erro ao adicionar coluna");
          this.isLoading = false;
        },
      });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}

