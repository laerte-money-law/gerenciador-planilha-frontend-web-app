import { Component } from "@angular/core";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { NgxSpinnerService } from "ngx-spinner";
import {  SpreadSheetDto, SpreadSheetRequestParamsDto } from "src/app/admin/models/spreadsheet.dto";
import { SpreadSheetService } from "src/app/admin/services/spreadsheet.service";
import { PaginationSpreadsheet } from "src/app/shared/utils/pagination-spreadsheet";
import { Router } from "@angular/router";

@Component({
    selector: "spreadsheet-list-page",
    templateUrl: "./spreadsheet-list.page.html",
    styles: ``,
})
export class SpreadSheetListPage extends BaseAppPageView {
    allRecords: SpreadSheetDto[] = [];
    pagination?: PaginationSpreadsheet<SpreadSheetDto>;
    requestParams: SpreadSheetRequestParamsDto = {
        limit: 15,
        page: 1
    }


    override getBreadcrumbs(): PageRoute[] {
        return [new PageRoute(this.URLS.API_ENDPOINTS.ADMIN.SPREADSHEET_LIST(), 'Planilhas', 'Planilhas')];
    }

    constructor(
        private readonly spinner: NgxSpinnerService,
        private readonly pageService: PageService,
        private readonly spreadSheetService: SpreadSheetService,
        private readonly router: Router
        
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadRecords();
    }

    private loadRecords(): void {
        this.spinner.show();

        this.spreadSheetService.findAllSpreadSheetsPaged(this.requestParams).subscribe({
            next: (response: any) => {
                this.allRecords = response.data;
                this.pagination = new PaginationSpreadsheet<SpreadSheetDto>(
                response.data,
                response.total,
                response.page,
                response.limit
                );


                this.spinner.hide();
            },                                                   
            error: (e) => {              
                this.spinner.hide();
                throw e;
            },
        });
   
        this.spinner.hide();
    }

     onEdit(id: string): void {
        this.router.navigate([this.URLS.PATHS.ADMIN.SPREADSHEET.DETAIL(false, id)]);
    }
}
