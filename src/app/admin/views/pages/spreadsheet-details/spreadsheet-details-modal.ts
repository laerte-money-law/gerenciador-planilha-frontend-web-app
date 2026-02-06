import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-spreadsheet-details-modal",
  templateUrl: "./spreadsheet-details-modal.html",
})
export class SpreadsheetDetailsModal {
  @Input() data!: Record<string, any>;

  constructor(public activeModal: NgbActiveModal) {}

  get entries() {
    return Object.entries(this.data);
  }
}
