import {Component, Input} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UploadAttachmentModal} from "../attachment-upload-modal/attachment-upload-modal";
import {AttachmentService} from "src/app/admin/services/attachment.service";
import {AttachmentDto} from "src/app/admin/attachments.dto";
import {SpreadSheetService} from "src/app/admin/services/spreadsheet.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: "app-spreadsheet-details-modal",
    templateUrl: "./spreadsheet-details-modal.html",
})
export class SpreadsheetDetailsModal {
    @Input() data!: Record<string, any>;
    @Input() spreadsheetId!: string;
    @Input() rowId!: number;
    @Input() onUpdateSuccess?: () => void;  // callback to refresh parent table

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private attachmentService: AttachmentService,
        private spreadsheetService: SpreadSheetService,
        private toastr: ToastrService
    ) {
    }

    attachments: AttachmentDto[] = [];
    isLoadingAttachments = false;
    isSaving = false;

    // editable copy of the row data
    editableData: Record<string, any> = {};
    // keys that originally held objects (so we present them as JSON strings)
    objectKeys = new Set<string>();

    entries: [string, any][] = [];

    // keys to exclude from editing
    private excludedKeys = new Set([
        "id_ml",
        "created_by",
        "last_updated_by",
        "team_id",
        "created_at",
        "attachments",
    ]);


    private shouldShowKey(key: string): boolean {
        if (!key) return false;
        const lower = key.toLowerCase();
        if (this.excludedKeys.has(lower)) return false;
        // exclude any field that is clearly an attachment or file reference
        if (lower.includes("attachment") || lower.includes("attachments") || lower.includes("file") || lower.includes("files")) return false;
        return true;
    }

    isString(value: any): boolean {
        return typeof value === "string";
    }

    isNumber(value: any): boolean {
        return typeof value === "number";
    }

    isObject(value: any): boolean {
        return value !== null && typeof value === "object";
    }

    isPrimitive(value: any): boolean {
        return this.isString(value) || this.isNumber(value) || typeof value === "boolean";
    }

    ngOnInit() {

        // create an editable copy of the data but exclude non-editable keys
        const source = this.data || {};
        Object.keys(source).forEach((k) => {
            if (!this.shouldShowKey(k)) return;

            const v = source[k];
            // if object, stringify for editing
            if (v !== null && typeof v === "object") {
                this.objectKeys.add(k);
                try {
                    this.editableData[k] = JSON.stringify(v, null, 2);
                } catch (e) {
                    this.editableData[k] = String(v);
                }
            } else {
                this.editableData[k] = v;
            }
        });


        this.entries = Object.entries(this.editableData).filter(([k]) => this.shouldShowKey(k));

        this.loadAttachments();
    }

    loadAttachments() {
        this.isLoadingAttachments = true;
        this.attachmentService
            .listAttachments(this.spreadsheetId, this.rowId)
            .subscribe({
                next: (res) => {
                    this.attachments = res;
                    this.isLoadingAttachments = false;
                },
                error: () => {
                    this.isLoadingAttachments = false;
                },
            });
    }

    openUpload() {
        const modalRef = this.modalService.open(UploadAttachmentModal, {
            centered: true,
        });

        modalRef.result.then((result) => {
            if (result) {
                this.handleUpload(result);
            }
        });
    }

    private handleUpload(payload: any) {
        const formData = new FormData();
        formData.append("file", payload.file);
        formData.append("spreadsheetMetadataId", this.spreadsheetId);
        formData.append("rowId", this.rowId.toString());
        formData.append("description", payload.description);

        this.attachmentService.uploadAttachment(formData).subscribe(() => {
            this.loadAttachments();
        });
    }

    openAttachment(url: string) {
        window.open(url, "_blank");
    }

    // Save edited row: prepare payload (parse JSON fields) and POST to update endpoint
    save(): void {
        if (this.isSaving) return;

        this.isSaving = true;

        const payload: Record<string, any> = {};

        // copy editableData and parse JSON fields back into objects where applicable
        Object.keys(this.editableData).forEach((k) => {
            let value = this.editableData[k];
            if (this.objectKeys.has(k) && typeof value === "string") {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // keep as string if parse fails
                    console.warn(`Failed to parse JSON for key ${k}`, e);
                }
            }
            payload[k] = value;
        });
        // POST any object as body (API accepts arbitrary object shape)
        this.spreadsheetService
            .updateRow(this.spreadsheetId, this.rowId, payload)
            .subscribe({
                next: (res) => {
                    this.toastr.success("Registro atualizado com sucesso");
                    this.activeModal.close({action: "update", payload: res});
                    if (this.onUpdateSuccess) {
                        this.onUpdateSuccess();
                    }
                },
                error: (err) => {
                    console.error("Erro ao atualizar registro", err);
                    this.toastr.error("Erro ao atualizar registro");
                    this.isSaving = false;
                },
            });
    }

    cancel(): void {
        this.activeModal.dismiss();
    }
}
