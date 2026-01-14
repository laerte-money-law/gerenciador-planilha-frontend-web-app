import { Injectable } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
    providedIn: "root",
})
export class ModalService {
    private activeModal: NgbModalRef | undefined;

    constructor(private readonly modalService: NgbModal) {}

    activeInstances = this.modalService.activeInstances;

    open(content: any, options: any) {
        this.activeModal = this.modalService.open(content, options);
        return this.activeModal;
    }

    close() {
        if (this.activeModal) {
            this.activeModal.close();
        }
    }

    dismissAll() {
        this.modalService.dismissAll();
    }

    dismiss(reason?: any) {
        if (this.activeModal) {
            this.activeModal.dismiss(reason);
        }
    }
}
