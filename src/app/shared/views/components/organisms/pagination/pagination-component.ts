import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() pages: number[] = [];
  @Input() currentPage = 1;
  @Input() isFirst = true;
  @Input() isLast = true;

  @Output() pageChange = new EventEmitter<number>();

  goTo(page: number) {
    if (!page || page === this.currentPage) return;
    this.pageChange.emit(page);
  }
  prev() {
    if (!this.isFirst) this.pageChange.emit(this.currentPage - 1);
  }
  next() {
    if (!this.isLast) this.pageChange.emit(this.currentPage + 1);
  }
}
