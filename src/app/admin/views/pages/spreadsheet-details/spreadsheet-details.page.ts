import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { NgxSpinnerService } from "ngx-spinner";
import { SpreadSheetService } from "src/app/admin/services/spreadsheet.service";
import {
    SpreadSheetDetailsDto,
    SpreadSheetRequestParamsDto,
} from "src/app/admin/models/spreadsheet.dto";

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

    constructor(
        private readonly pageService: PageService,
        private readonly spinner: NgxSpinnerService,
        private readonly spreadsheetService: SpreadSheetService,
        private readonly route: ActivatedRoute
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
            status: "IN PROGRESS",
        };

        this.spinner.show();

        this.spreadsheetService
            .getSpreadSheetPaged(this.spreadsheetId, params)
            .subscribe({
                next: (response) => {
                    this.allRecordsInProgress = response;
                    this.totalRecordsInProgress = response.total;

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
            status: "VALIDATED",
        };

        this.spinner.show();

        this.spreadsheetService
            .getSpreadSheetPaged(this.spreadsheetId, params)
            .subscribe({
                next: (response) => {
                    this.allRecordsValidated = response;
                    this.totalRecordsValidated = response.total;

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

    
}
