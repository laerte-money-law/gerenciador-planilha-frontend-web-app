import * as _ from "lodash";
import { Constants } from "./constants";

export class Pagination<T> {
    private readonly _records: T[];
    private readonly _pageSize: number;
    private readonly _totalPages: number;
    private _currentPage: number;

    public getTotalPages(): number {
        return this._totalPages;
    }

    public getTotalPagesAsArray(): number[] {
        return _.range(1, this._totalPages + 1);
    }

    public getCurrentPage(): number {
        return this._currentPage;
    }

    public getPageSize(): number {
        return this._pageSize;
    }

    public getTotalRecords(): number {
        return this._records.length;
    }

    public getPageRecordsIndex(): { from: number; to: number } {
        const startIndex = (this._currentPage - 1) * this._pageSize;
        const pageTotalRecords = this._pageSize * this._currentPage;
        const endIndex = pageTotalRecords > this._records.length ? this._records.length : pageTotalRecords;
        // const endIndex = startIndex + this._pageSize;
        return { from: startIndex + 1, to: endIndex };
    }

    constructor(records: T[], pageSize: number = Constants.PAGE_SIZE) {
        this._records = records;
        this._pageSize = pageSize;
        this._totalPages = Math.ceil(records.length / pageSize);
        this._currentPage = 1;
    }

    getPage(): T[] {
        const startIndex = (this._currentPage - 1) * this._pageSize;
        const endIndex = startIndex + this._pageSize;
        return _.slice(this._records, startIndex, endIndex);
    }

    goToPage(page: number): void {
        this._currentPage = page;
        if (this._currentPage > this._totalPages) {
            this._currentPage = this._totalPages;
        } else if (this._currentPage < 1) {
            this._currentPage = 1;
        }
    }

    // Show 5 page buttons around the current page
    getVisiblePages(maxButtons: number = 5): number[] {
        const totalPages = this._totalPages;
        const currentPage = this._currentPage;

        const half = Math.floor(maxButtons / 2);
        let start = Math.max(currentPage - half, 1);
        let end = start + maxButtons - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(end - maxButtons + 1, 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    goToFirstPage(): void {
        this._currentPage = 1;
    }

    isFirstPage(): boolean {
        return this._currentPage === 1;
    }

    goToPreviousPage(): void {
        this._currentPage--;
        if (this._currentPage < 1) {
            this._currentPage = 1;
        }
    }

    goToNextPage(): void {
        this._currentPage++;
        if (this._currentPage > this._totalPages) {
            this._currentPage = this._totalPages;
        }
    }

    goToLastPage(): void {
        this._currentPage = this._totalPages;
    }

    isLastPage(): boolean {
        return this._currentPage === this._totalPages;
    }
}
