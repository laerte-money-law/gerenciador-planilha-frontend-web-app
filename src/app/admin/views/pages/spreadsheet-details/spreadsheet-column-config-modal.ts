import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-spreadsheet-column-config-modal',
  templateUrl: './spreadsheet-column-config-modal.html'
})
export class SpreadsheetColumnConfigModal implements OnInit {
  @Input() allColumns: string[] = [];
  @Input() visibleColumnsArray: string[] = [];

  visibleColumns: Set<string> = new Set();

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.visibleColumns = new Set(this.visibleColumnsArray);
  }

  toggleColumn(col: string): void {
    if (this.visibleColumns.has(col)) {
      this.visibleColumns.delete(col);
    } else {
      this.visibleColumns.add(col);
    }
  }

  formatColumnName(column: string): string {
    return column ? column.replace(/_/g, ' ') : '';
  }

  save(): void {
    this.activeModal.close({
      visibleColumns: Array.from(this.visibleColumns)
    });
  }
}
