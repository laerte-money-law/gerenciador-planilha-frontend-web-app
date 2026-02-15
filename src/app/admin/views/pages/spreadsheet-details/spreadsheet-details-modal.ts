import { Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UploadAttachmentModal } from "../attachment-upload-modal/attachment-upload-modal";

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
    private modalService: NgbModal
  ) {}

  get entries() {
    return Object.entries(this.data);
  }

  openUpload() {
    const modalRef = this.modalService.open(UploadAttachmentModal, {
      centered: true,
    });

    modalRef.result.then((result) => {
      if (result) {
        this.activeModal.close({
          action: 'upload',
          payload: result,
        });
      }
    });
  }
}
