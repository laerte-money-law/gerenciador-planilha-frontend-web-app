import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-upload-attachment-modal",
    templateUrl: "./attachment-upload-modal.html",
})
export class UploadAttachmentModal {
     
    form = this.fb.group({
        description: ["", Validators.required],
    });

    
    file: File | null = null;
    
    constructor(
        private fb: FormBuilder,
        public activeModal: NgbActiveModal
    ) {}

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files?.length) {
            const file = input.files[0];

            const allowedTypes = [
            'application/pdf',
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ];

            const isImage = file.type.startsWith('image/');

            if (!isImage && !allowedTypes.includes(file.type)) {
            alert('Tipo de arquivo não permitido');
            return;
            }

            if (file.size > 10 * 1024 * 1024) {
            alert('Arquivo maior que 10MB');
            return;
            }

            this.file = file;
        }
    }


    submit() {
        if (this.form.invalid || !this.file) return;

        this.activeModal.close({
            description: this.form.value.description,
            file: this.file,
        });

    }

   cancel() {
        this.activeModal.dismiss();
    }
}