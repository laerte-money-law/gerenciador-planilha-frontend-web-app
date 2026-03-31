import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ATTACHMENT_TYPE } from "src/app/shared/models/enums/upload-attachament.enum";
import { FileInfoDto } from "src/app/shared/models/file-info.dto";

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
    fileInfo: FileInfoDto | null = null;

    filePondOptions = {
        class: "my-filepond",
        instantUpload: false,
        allowRevert: false,
        allowMultiple: false,
        labelIdle: "Arraste e solte o arquivo nesta área cinza </br> ou <span class='filepond--label-action'>clique aqui para procurar</span>",
    };
    
    constructor(
        private fb: FormBuilder,
        public activeModal: NgbActiveModal
    ) {}

    pondHandleAddFile(event: any) {
        const file = event.file.file;

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
        this.fileInfo = {
            fileName: file.name,
            fileSize: file.size,
            createdAt: new Date()
        };
    }

    onReplaceFile() {
        this.fileInfo = null;
        this.file = null;
    }

    onDeleteFile() {
        this.fileInfo = null;
        this.file = null;
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