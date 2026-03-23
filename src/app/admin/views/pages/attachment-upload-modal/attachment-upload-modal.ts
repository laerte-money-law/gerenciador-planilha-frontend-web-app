import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ATTACHMENT_TYPE } from "src/app/shared/models/enums/upload-attachament.enum";

@Component({
    selector: "app-upload-attachment-modal",
    templateUrl: "./attachment-upload-modal.html",
})
export class UploadAttachmentModal {

    attachmentTypes = Object.values(ATTACHMENT_TYPE);
     
    form = this.fb.group({
        description: [""],
        type: [null, Validators.required]
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
            description: this.form.get('description')?.value ?? '',
            type: this.form.get('type')?.value,
            file: this.file,
        });
    }

   cancel() {
        this.activeModal.dismiss();
    }
}