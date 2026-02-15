import { Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UploadAttachmentModal } from "../attachment-upload-modal/attachment-upload-modal";
import { AttachmentService } from "src/app/admin/services/attachment.service";
import { AttachmentDto } from "src/app/admin/attachments.dto";

@Component({
  selector: "app-spreadsheet-details-modal",
  templateUrl: "./spreadsheet-details-modal.html",
})
export class SpreadsheetDetailsModal {
  @Input() data!: Record<string, any>;
  @Input() spreadsheetId!: string;
  @Input() rowId!: number;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private attachmentService: AttachmentService
  ) {}

  attachments: AttachmentDto[] = [];
  isLoadingAttachments = false;


  get entries() {
    return Object.entries(this.data);
  }

  ngOnInit() {
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
    formData.append('file', payload.file);
    formData.append('spreadsheetMetadataId', this.spreadsheetId);
    formData.append('rowId', this.rowId.toString());
    formData.append('description', payload.description);

    this.attachmentService.uploadAttachment(formData)
      .subscribe(() => {
        this.loadAttachments(); 
      });
  }


  openAttachment(url: string) {
    window.open(url, '_blank');
  }

}
