import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TeamDto } from "src/app/admin/models/spreadsheet.dto";

@Component({
  selector: "app-upload-spreadsheet-modal",
  templateUrl: "./spreadsheet-upload-modal.html",
})
export class UploadSpreadSheetModal {
  teams: TeamDto[] = [
    { id: 1, name: 'Client 1' },
  
  ];

  form = this.fb.group({
    team: [null as number | null, Validators.required],
    service: ["", Validators.required],
  });

  file: File | null = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.file = input.files[0];
    }
  }

  submit() {
    if (this.form.invalid || !this.file) return;

    this.activeModal.close({
      team: this.form.value.team,
      service: this.form.value.service,
      file: this.file,
    });
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
