import { Component } from "@angular/core";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { NgxSpinnerService } from "ngx-spinner";
import { AdminPolicyService } from "src/app/admin/services/admin-policy.service";
import {ClientPolicyDto, SpreadsheetDto} from "src/app/client/models/dto/client-policy.dto";
import { Pagination } from "src/app/shared/utils/pagination";

@Component({
    selector: "admin-policy-list-page",
    templateUrl: "./admin-policy-list.page.html",
    styles: ``,
})
export class AdminPolicyListPage extends BaseAppPageView {
    allRecords:  SpreadsheetDto[] = [];
    filteredList: SpreadsheetDto[] = [];
    pagination: Pagination<SpreadsheetDto> = new Pagination<SpreadsheetDto>([]);

    test = null

    override getBreadcrumbs(): PageRoute[] {
        return [new PageRoute(this.URLS.PATHS.ADMIN.POLICY.ROOT(), "Apólices", "Apólices")];
    }

    constructor(
        private readonly spinner: NgxSpinnerService,
        private readonly pageService: PageService,
        private readonly adminPolicyService: AdminPolicyService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadRecords();
    }

    private loadRecords(): void {
        this.spinner.show();

        /*this.adminPolicyService.findAllPolicies().subscribe({
            next: (response) => {
                this.allRecords = response;
                this.filteredList = this.allRecords;
                this.refreshPagination();

                this.spinner.hide();
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });*/
        this.allRecords = [
            {
                name: "Planilha 01",
                servico: "DNI",
                client: "Cliente 01",
                createdAt: new Date(),
                status: "PENDING"
            },
            {
                name: "Planilha 02",
                servico: "Recuperação",
                client: "CLiente 02",
                createdAt: new Date(),
                status: "IN_PROGRESS"
            },
            {
                name: "Planilha 03",
                servico: "DNI",
                client: "Cliente 03",
                createdAt: new Date(),
                status: "DONE"
            },
        ]

        this.filteredList = this.allRecords;
        this.refreshPagination();
        this.spinner.hide();
    }

    private refreshPagination(): void {
        this.pagination = new Pagination(this.filteredList);
    }
}
