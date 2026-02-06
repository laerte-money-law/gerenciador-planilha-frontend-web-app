export class PaginationSpreadsheet<T> {
  private readonly _records: T[];
  private readonly _pageSize: number;
  private readonly _totalRecords: number;
  private readonly _totalPages: number;
  private _currentPage: number;

  constructor(
    records: T[],
    totalRecords: number,
    currentPage: number,
    pageSize: number
  ) {
    this._records = records;
    this._pageSize = pageSize;
    this._totalRecords = totalRecords;
    this._currentPage = currentPage;
    this._totalPages = Math.ceil(totalRecords / pageSize);
  }

  getPage(): T[] {
    return this._records;
  }

  getTotalPages(): number {
    return this._totalPages;
  }

  getCurrentPage(): number {
    return this._currentPage;
  }

  getTotalRecords(): number {
    return this._totalRecords;
  }

  goToNextPage(): number {
  return Math.min(this._currentPage + 1, this._totalPages);
}

goToPreviousPage(): number {
  return Math.max(this._currentPage - 1, 1);
}

goToPage(page: number): number {
  if (page < 1) return 1;
  if (page > this._totalPages) return this._totalPages;
  return page;
}
isFirstPage(): boolean {
  return this._currentPage <= 1;
}

isLastPage(): boolean {
  return this._currentPage >= this._totalPages;
}

getTotalPagesAsArray(): number[] {
  return Array.from({ length: this._totalPages }, (_, i) => i + 1);
}


}
