import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {ConfirmModalComponent} from "../views/components/organisms/modals/confirmation-modal/confirm-modal.component";

@Injectable({ providedIn: "root" })
export class ConfirmationService {

    constructor(private modalService: NgbModal) {}

    confirm(options: {
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
    }): Promise<boolean> {

        const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true
        });

        modalRef.componentInstance.title = options.title;
        modalRef.componentInstance.message = options.message;
        modalRef.componentInstance.confirmText = options.confirmText || "Confirmar";
        modalRef.componentInstance.cancelText = options.cancelText || "Cancelar";

        return modalRef.result
            .then(() => true)
            .catch(() => false);
    }
}
