import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { NgxSpinnerService } from "ngx-spinner";
import { SpreadSheetService } from "src/app/admin/services/spreadsheet.service";
import { SpreadsheetDetailsModal } from "./spreadsheet-details-modal";
import { SpreadsheetAddColumnModal } from "./spreadsheet-add-column-modal";
import { SpreadsheetDeleteColumnModal } from "./spreadsheet-delete-column-modal";
import { SpreadsheetColumnConfigModal } from "./spreadsheet-column-config-modal";

import {
    SpreadSheetDetailsDto,
    SpreadSheetRequestParamsDto,
} from "src/app/admin/models/spreadsheet.dto";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AttachmentService } from "src/app/admin/services/attachment.service";

@Component({
    selector: "spreadsheet-details-page",
    templateUrl: "./spreadsheet-details.page.html",
    styles: [],
})
export class SpreadSheetDetailsPage extends BaseAppPageView {
    allRecordsInProgress?: SpreadSheetDetailsDto;
    allRecordsValidated?: SpreadSheetDetailsDto;

    inProgressPage = 1;
    inProgressLimit = 8;
    totalRecordsInProgress = 0;

    validatedPage = 1;
    validatedLimit = 8;
    totalRecordsValidated = 0;

    spreadsheetId!: string;
    isLoading = false;

    inProgressVisibleColumns: string[] = [];
    validatedVisibleColumns: string[] = [];

    get inProgressStorageKey(): string {
        return `spreadsheet_${this.spreadsheetId}_table_inProgress`;
    }

    get validatedStorageKey(): string {
        return `spreadsheet_${this.spreadsheetId}_table_validated`;
    }

    constructor(
        private readonly pageService: PageService,
        private readonly spinner: NgxSpinnerService,
        private readonly spreadsheetService: SpreadSheetService,
        private readonly attachmentService: AttachmentService,
        private readonly route: ActivatedRoute,
        private modalService: NgbModal

    ) {
        super();
    }

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(
                this.URLS.PATHS.ADMIN.SPREADSHEET.ROOT(),
                "Planilhas",
                "Planilhas"
            ),
        ];
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());

        const id = this.route.snapshot.paramMap.get("id");
        if (!id) {
            console.error("ID da planilha não encontrado na rota");
            return;
        }

        this.spreadsheetId = id;

        this.loadInProgress();
        this.loadValidated();
    }

    private loadInProgress(): void {
        const params: SpreadSheetRequestParamsDto = {
            page: this.inProgressPage,
            limit: this.inProgressLimit,
        };
        this.spinner.show();

        this.spreadsheetService
            .getSpreadSheetPaged(this.spreadsheetId, params)
            .subscribe({
                next: (response) => {
                    response.rows?.forEach(row => this.formatRowData(row));
                    this.allRecordsInProgress = response;
                    this.totalRecordsInProgress = response.total;

                    const savedCols = localStorage.getItem(this.inProgressStorageKey);
                    if (savedCols) {
                        this.inProgressVisibleColumns = JSON.parse(savedCols).filter((c: string) => this.allRecordsInProgress!.columns.includes(c));
                    } else {
                        this.inProgressVisibleColumns = [...this.allRecordsInProgress!.columns];
                    }

                    this.updateBreadcrumb(response.name);
                    this.spinner.hide();
                },
                error: (error) => {
                    console.error("Erro ao carregar registros IN PROGRESS", error);
                    this.spinner.hide();
                },
            });
    }

    private loadValidated(): void {
        const params: SpreadSheetRequestParamsDto = {
            page: this.validatedPage,
            limit: this.validatedLimit,
            status: "VALIDADO",
        };

        this.spinner.show();

        this.spreadsheetService
            .getSpreadSheetPaged(this.spreadsheetId, params)
            .subscribe({
                next: (response) => {
                    response.rows?.forEach(row => this.formatRowData(row));
                    this.allRecordsValidated = response;
                    this.totalRecordsValidated = response.total;

                    const savedCols = localStorage.getItem(this.validatedStorageKey);
                    if (savedCols) {
                        this.validatedVisibleColumns = JSON.parse(savedCols).filter((c: string) => this.allRecordsValidated!.columns.includes(c));
                    } else {
                        this.validatedVisibleColumns = [...this.allRecordsValidated!.columns];
                    }

                    this.updateBreadcrumb(response.name);
                    this.spinner.hide();
                },
                error: (error) => {
                    console.error("Erro ao carregar registros VALIDATED", error);
                    this.spinner.hide();
                },
            });
    }

    private updateBreadcrumb(sheetName: string): void {
        this.pageService.setToolbar([
            new PageRoute(
                this.URLS.PATHS.ADMIN.SPREADSHEET.ROOT(),
                "Planilhas",
                "Planilhas"
            ),
            new PageRoute(null, sheetName, sheetName),
        ]);
    }


    get inProgressTotalPages(): number {
        if (!this.totalRecordsInProgress) return 0;
        return Math.ceil(this.totalRecordsInProgress / 15);
    }


    get validatedTotalPages(): number {
        return Math.ceil(this.totalRecordsValidated / this.validatedLimit);
    }

    goToInProgressPage(page: number): void {
        if (page < 1 || page > this.inProgressTotalPages) return;
        this.inProgressPage = page;
        this.loadInProgress();
    }

    goToValidatedPage(page: number): void {
        if (page < 1 || page > this.validatedTotalPages) return;
        this.validatedPage = page;
        this.loadValidated();
    }

    getVisiblePages(current: number, total: number, delta = 2): number[] {
        const pages: number[] = [];

        const start = Math.max(1, current - delta);
        const end = Math.min(total, current + delta);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }

    trackByRowId(_: number, row: any): any {
        return row.id;
    }
    openRowDetails(row: Record<string, any>): void {
        const modalRef = this.modalService.open(SpreadsheetDetailsModal, {
            centered: true,
            scrollable: true,
        });

        modalRef.componentInstance.data = row;
        modalRef.componentInstance.spreadsheetId = this.spreadsheetId;
        modalRef.componentInstance.rowId = row["ML_ID"];
        modalRef.componentInstance.onUpdateSuccess = () => {
            this.loadInProgress();
            this.loadValidated();
        };

        modalRef.result.then((result) => {
            if (result?.action === 'upload') {
                this.handleUpload(result.payload, row["ML_ID"]);
            }
        });
    }

    openAddColumnModal(): void {
        const modalRef = this.modalService.open(SpreadsheetAddColumnModal, {
            centered: true,
            scrollable: true,
        });

        modalRef.componentInstance.spreadsheetId = this.spreadsheetId;

        modalRef.result.then((result) => {
            if (result?.success) {
                this.loadInProgress();
                this.loadValidated();
            }
        });
    }

    openDeleteColumnModal(): void {
        const modalRef = this.modalService.open(SpreadsheetDeleteColumnModal, {
            centered: true,
            scrollable: true,
        });

        modalRef.componentInstance.spreadsheetId = this.spreadsheetId;

        modalRef.result.then((result) => {
            if (result?.success) {
                this.loadInProgress();
                this.loadValidated();
            }
        });
    }

    exportSpreadsheet(): void {
        this.spreadsheetService.exportSpreadsheet(this.spreadsheetId)
            .subscribe((response) => {

                const contentDisposition = response.headers.get('content-disposition');
                const fileName = this.extractFileName(contentDisposition);

                const blob = response.body!;
                const objectUrl = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = objectUrl;
                a.download = fileName;
                a.click();

                URL.revokeObjectURL(objectUrl);
            });
    }

    truncateText(text: any, limit: number = 30): string {
        if (text === null || text === undefined) return '';
        const str = text.toString();
        return str.length > limit ? str.substring(0, limit) + '...' : str;
    }

    formatCellValue(value: any): any {
        if (!value || typeof value !== 'string') return value;
        let str = value.trim();

        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/;
        const dateMatch = str.match(dateRegex);
        if (dateMatch) {
            let month = dateMatch[1].padStart(2, '0');
            let day = dateMatch[2].padStart(2, '0');
            let year = dateMatch[3];
            if (year.length === 2) {
                year = '20' + year;
            }
            return `${day}/${month}/${year}`;
        }

        const moneyRegex = /^(R\$\s*)?(-?[\d,]+)\.(\d{2})$/;
        const moneyMatch = str.match(moneyRegex);
        if (moneyMatch) {
            const prefix = moneyMatch[1] || '';
            let integerPart = moneyMatch[2].replace(/,/g, '.');
            let decimalPart = moneyMatch[3];
            return `${prefix}${integerPart},${decimalPart}`;
        }

        return value;
    }

    private formatRowData(row: Record<string, any>) {
        if (!row) return;
        Object.keys(row).forEach(key => {
            row[key] = this.formatCellValue(row[key]);
        });
    }

    formatColumnName(column: string): string {
        return column ? column.replace(/_/g, ' ') : '';
    }

    shouldDisplayColumn(column: string): boolean {
        return column !== 'ML_ID' && column !== 'ML_USER_ATRIBUIDO';
    }

    shouldDisplayColumnInProgress(column: string): boolean {
        return this.shouldDisplayColumn(column) && this.inProgressVisibleColumns.includes(column);
    }

    shouldDisplayColumnValidated(column: string): boolean {
        return this.shouldDisplayColumn(column) && this.validatedVisibleColumns.includes(column);
    }

    openConfigColumnsInProgress(): void {
        const modalRef = this.modalService.open(SpreadsheetColumnConfigModal, {
            centered: true,
            scrollable: true,
        });

        const availableColumns = (this.allRecordsInProgress?.columns || []).filter(c => this.shouldDisplayColumn(c));
        modalRef.componentInstance.allColumns = availableColumns;
        modalRef.componentInstance.visibleColumnsArray = this.inProgressVisibleColumns;

        modalRef.result.then((result) => {
            if (result?.visibleColumns) {
                this.inProgressVisibleColumns = result.visibleColumns;
                localStorage.setItem(this.inProgressStorageKey, JSON.stringify(this.inProgressVisibleColumns));
            }
        }).catch(() => {});
    }

    openConfigColumnsValidated(): void {
        const modalRef = this.modalService.open(SpreadsheetColumnConfigModal, {
            centered: true,
            scrollable: true,
        });

        const availableColumns = (this.allRecordsValidated?.columns || []).filter(c => this.shouldDisplayColumn(c));
        modalRef.componentInstance.allColumns = availableColumns;
        modalRef.componentInstance.visibleColumnsArray = this.validatedVisibleColumns;

        modalRef.result.then((result) => {
            if (result?.visibleColumns) {
                this.validatedVisibleColumns = result.visibleColumns;
                localStorage.setItem(this.validatedStorageKey, JSON.stringify(this.validatedVisibleColumns));
            }
        }).catch(() => {});
    }

    private handleUpload(payload: any, rowId: number) {
        const formData = new FormData();
        formData.append('file', payload.file);
        formData.append('spreadsheetMetadataId', this.spreadsheetId);
        formData.append('rowId', rowId.toString());
        formData.append('description', payload.description);

        this.attachmentService.uploadAttachment(formData)
            .subscribe({
                next: () => {
                    console.log('Upload realizado com sucesso');
                },
                error: (err) => {
                    console.error('Erro no upload', err);
                }
            });
    }

    private extractFileName(contentDisposition: string | null): string {
        if (!contentDisposition) {
            return 'download.xlsx';
        }

        const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/);

        if (match && match[1]) {
            return decodeURIComponent(match[1].replace(/["']/g, ''));
        }

        return 'download.xlsx';
    }
}
