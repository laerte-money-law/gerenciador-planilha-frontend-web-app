import { Component, EventEmitter, inject, Input, Output, Type } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-save-modal-button",
    template: `<button type="button" class="btn btn-sm btn-primary" (click)="openForm()">{{ buttonText }}</button>`,
})
export class ModalButtonComponent {
    private modalService = inject(NgbModal);

    @Output() saved = new EventEmitter<any>();
    @Output() opened = new EventEmitter<any>();

    @Input() formComponent!: Type<any>;
    @Input() buttonText: string = "";

    openForm() {
        this.opened.emit();

        const modalRef = this.modalService.open(this.formComponent, { centered: true, size: "lg" });

        modalRef.result.then(
            (result) => {
                this.saved.emit(result);
            },
            (reason) => {
                console.log("Modal dismissed:", reason);
            }
        );
    }
}
