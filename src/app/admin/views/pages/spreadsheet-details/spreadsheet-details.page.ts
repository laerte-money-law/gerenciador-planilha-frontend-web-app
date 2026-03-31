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

import { SpreadSheetDetailsDto, SpreadSheetRequestParamsDto } from "src/app/admin/models/spreadsheet.dto";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AttachmentService } from "src/app/admin/services/attachment.service";
import { SPREADSHEET_VIEW } from "src/app/shared/models/enums/spreadsheet-view-param-status.const";

interface ViewState {
  name: string;
  data: any;
  page: number;
  limit: number;
  total: number;
  visibleColumns: string[];
  storageKey: () => string;
}
@Component({
  selector: "spreadsheet-details-page",
  templateUrl: "./spreadsheet-details.page.html",
})
export class SpreadSheetDetailsPage extends BaseAppPageView {

  override getBreadcrumbs(): PageRoute[] {
    return [new PageRoute(this.URLS.PATHS.ADMIN.SPREADSHEET.ROOT(), "Planilhas", "Planilhas")];
  }

  spreadsheetId!: string;

  views: Record<string, ViewState> = {
    inicial: this.createView("inicial"),
    pendente: this.createView("pendente"),
    analise: this.createView("analise"),
    concluido: this.createView("concluido"),
  };

  

  constructor(
    private spreadsheetService: SpreadSheetService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private attachmentService: AttachmentService,
  ) {
    super();
  }
  private loadingCount = 0;
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) return;

    this.spreadsheetId = id;

    this.loadAll();
  }

  // ===== FACTORY DE VIEW =====

  private createView(view: string) {
    return {
      name: view,
      data: null,
      page: 1,
      limit: 8,
      total: 0,
      visibleColumns: [],
      storageKey: () => `spreadsheet_${this.spreadsheetId}_${view}`,
    };
  }

  // ===== LOAD =====

  loadAll() {
    Object.keys(this.views).forEach((v) => this.loadView(v));
  }

  loadView(viewKey: string) {
    const view = this.views[viewKey];

    // incrementa antes da chamada
    this.loadingCount++;
    this.spinner.show();

    this.spreadsheetService.getSpreadSheetPaged(this.spreadsheetId, {
        view: view.name,
        page: view.page,
        limit: view.limit,
    }).subscribe({
        next: (res) => {
        res.rows?.forEach((r: any) => this.formatRowData(r));

        view.data = res;
        view.total = res.total;

        view.visibleColumns = this.loadColumns(
            view.storageKey(),
            res.columns
        );

        this.handleLoadingFinish();
        },
        error: (err) => {
        console.error("Erro ao carregar view:", viewKey, err);
        this.handleLoadingFinish();
        }
    });
    }

  // ===== PAGINAÇÃO =====

  goToPage(viewKey: string, page: number) {
    const view = this.views[viewKey];

    view.page = page;
    this.loadView(viewKey);
  }

  getTotalPages(viewKey: string): number {
    const view = this.views[viewKey];
    return Math.ceil(view.total / view.limit);
  }

  // ===== CONFIG COLUNAS =====

  openConfig(viewKey: string) {
    const view = this.views[viewKey];

    const modalRef = this.modalService.open(SpreadsheetColumnConfigModal);

    modalRef.componentInstance.allColumns =
      (view.data?.columns || []).filter((c: string) =>
        this.shouldDisplayColumn(c)
      );

    modalRef.componentInstance.visibleColumnsArray =
      view.visibleColumns;

    modalRef.result.then((result) => {
      if (result?.visibleColumns) {
        view.visibleColumns = result.visibleColumns;

        localStorage.setItem(
          view.storageKey(),
          JSON.stringify(result.visibleColumns)
        );
      }
    });
  }

  // ===== DISPLAY =====

  shouldDisplayColumn(column: string): boolean {
    return column !== "ML_ID" && column !== "ML_USER_ATRIBUIDO";
  }

  shouldDisplay(viewKey: string, column: string): boolean {
    const view = this.views[viewKey];
    return this.shouldDisplayColumn(column) &&
           view.visibleColumns.includes(column);
  }

  // ===== UTILS =====

  private loadColumns(storageKey: string, columns: string[]): string[] {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return [...columns];

    try {
        return JSON.parse(saved).filter((c: string) =>
            columns.includes(c)
        );
        } catch {
        return [...columns];
        }
    }

    private handleLoadingFinish() {
        this.loadingCount--;

        if (this.loadingCount <= 0) {
            this.loadingCount = 0; // evita negativo
            this.spinner.hide();
        }
}
  // ===== RELOAD GLOBAL =====

  reloadAll() {
    this.loadAll();
  }

  // ===== MODAIS =====

  openAddColumnModal() {
    const modalRef = this.modalService.open(SpreadsheetAddColumnModal);

    modalRef.result.then((r) => {
      if (r?.success) this.reloadAll();
    });
  }

  openDeleteColumnModal() {
    const modalRef = this.modalService.open(SpreadsheetDeleteColumnModal);

    modalRef.result.then((r) => {
      if (r?.success) this.reloadAll();
    });
  }

  openRowDetails(row: Record<string, any>, viewKey: string): void {
        const modalRef = this.modalService.open(SpreadsheetDetailsModal, {
            centered: true,
            scrollable: true,
            size: 'xl',
            modalDialogClass: 'w-75 mw-100',
        });

        const view = this.views[viewKey];

        modalRef.componentInstance.data = row;
        modalRef.componentInstance.spreadsheetId = this.spreadsheetId;
        modalRef.componentInstance.rowId = row["ML_ID"];
        modalRef.componentInstance.columns = view.data?.columns || [];
        modalRef.componentInstance.view = viewKey;

        modalRef.componentInstance.onUpdateSuccess = () => {
            this.loadAll();
        };

        modalRef.result
        .then((result) => {
            if (result?.action === "upload") {
            this.handleUpload(result.payload, row["ML_ID"]);
            }
        })
        .catch(() => {});    
    }

  // ===== Utils =====
  formatCellValue(value: any): any {
        if (!value || typeof value !== "string") return value;
        let str = value.trim();

        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/;
        const dateMatch = str.match(dateRegex);
        if (dateMatch) {
            let month = dateMatch[1].padStart(2, "0");
            let day = dateMatch[2].padStart(2, "0");
            let year = dateMatch[3];
            if (year.length === 2) {
                year = "20" + year;
            }
            return `${day}/${month}/${year}`;
        }

        const moneyRegex = /^(R\$\s*)?(-?[\d,]+)\.(\d{2})$/;
        const moneyMatch = str.match(moneyRegex);
        if (moneyMatch) {
            const prefix = moneyMatch[1] || "";
            let integerPart = moneyMatch[2].replace(/,/g, ".");
            let decimalPart = moneyMatch[3];
            return `${prefix}${integerPart},${decimalPart}`;
        }

        return value;
    }

    private formatRowData(row: Record<string, any>) {
        if (!row) return;
        Object.keys(row).forEach((key) => {
            row[key] = this.formatCellValue(row[key]);
        });
    }

    private handleUpload(payload: any, rowId: number) {
        const formData = new FormData();
        formData.append("file", payload.file);
        formData.append("spreadsheetMetadataId", this.spreadsheetId);
        formData.append("rowId", rowId.toString());
        formData.append("description", payload.description);

        this.attachmentService.uploadAttachment(formData).subscribe({
            next: () => {
                console.log("Upload realizado com sucesso");
            },
            error: (err) => {
                console.error("Erro no upload", err);
            },
        });
    }

    private extractFileName(contentDisposition: string | null): string {
        if (!contentDisposition) {
            return "download.xlsx";
        }

        const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/);

        if (match && match[1]) {
            return decodeURIComponent(match[1].replace(/["']/g, ""));
        }

        return "download.xlsx";
    }

    truncateText(text: any, limit: number = 30): string {
        if (text === null || text === undefined) return "";
        const str = text.toString();
        return str.length > limit ? str.substring(0, limit) + "..." : str;
    }

    exportSpreadsheet(): void {
        this.spreadsheetService.exportSpreadsheet(this.spreadsheetId).subscribe((response) => {
            const contentDisposition = response.headers.get("content-disposition");
            const fileName = this.extractFileName(contentDisposition);
            console.log("Nome do arquivo extraído:", fileName);

            const blob = response.body!;
            const objectUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = objectUrl;
            a.download = fileName;
            a.click();

            URL.revokeObjectURL(objectUrl);
        });
    }
  formatColumnName(column: string): string {
    return column ? column.replace(/_/g, ' ') : '';
  }



 trackByRowId(_: number, row: any): any {
    return row["ML_ID"];    
}
// ======= Paginação =======
    getVisiblePages(currentPage: number, totalPages: number): number[] {
        const pages: number[] = [];

        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }
}


    
    
