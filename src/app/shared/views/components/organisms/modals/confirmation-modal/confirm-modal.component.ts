import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-confirm-modal",
    templateUrl: "./confirm-modal.component.html",
    standalone: true
})
export class ConfirmModalComponent {

    @Input() title: string = "Confirmar ação";
    @Input() message: string = "Tem certeza que deseja continuar?";
    @Input() confirmText: string = "Confirmar";
    @Input() cancelText: string = "Cancelar";

    constructor(public activeModal: NgbActiveModal) {}

    confirm() {
        this.activeModal.close(true);
    }

    cancel() {
        this.activeModal.dismiss(false);
    }
}
