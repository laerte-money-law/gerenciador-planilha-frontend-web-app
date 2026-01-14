export class RemotePagination<T> {
  private _items: T[] = [];
  private _page = 1;
  private _pageCount = 1;

  constructor(private fetchPageFn: (page: number) => void) {}

  sync(items: T[], meta: { page: number; pageCount: number }) {
    this._items = items ?? [];
    this._page = meta?.page ?? 1;
    this._pageCount = meta?.pageCount ?? 1;
    }

    getPage(): T[] {
        return this._items;
    }

    goToPage(p: number) {
        if (p < 1 || p > this._pageCount) return;
        this.fetchPageFn(p); 
    }

    goToPreviousPage() { 
        this.goToPage(this._page - 1);
    }
    
    goToNextPage() {
        this.goToPage(this._page + 1);
    }

    getCurrentPage(): number {
        return this._page;
    }

    getTotalPages(): number  {
        return this._pageCount
    }

    getTotalPagesAsArray(): number[] {
        return Array.from({ 
            length: this._pageCount },
             (_, i) => i + 1)
        }
   
    isFirstPage(): boolean {
        return this._page <= 1
    }

    isLastPage(): boolean  {
        return this._page >= this._pageCount
    }
     
}