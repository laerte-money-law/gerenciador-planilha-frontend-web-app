import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { NotificationService } from "../../../../shared/services/notification.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AdminDepositGuideService } from "src/app/admin/services/admin-deposit-guide.service";
import { DepositGuideDto } from "src/app/admin/models/deposit-guide.dto";
import { Pagination } from "src/app/shared/utils/pagination";
import { InputDateComponent } from "src/app/shared/views/components/atoms/input-date/input-date.component";
import { InputTextComponent } from "src/app/shared/views/components/atoms/input-text/input-text.component";
import { DepositGuideFilter } from "src/app/admin/models/admin-deposit-guide-query-params.dto";
import { debounceTime, distinctUntilChanged, fromEvent, map } from "rxjs";

@Component({
    selector: "admin-deposit-invoice-list-page",
    templateUrl: "./admin-deposit-invoice-list.page.html",
    styles: ``,
})
export class AdminDepositInvoiceListPage extends BaseAppPageView {
    advancedFilterOption = {
        hide: true,
        categoriesOption: [{ value: "PAGO" }, { value: "AGENDADO" }, { value: "PENDENTE" }, { value: "RECURSO" }],
    };
    invoiceSelectedId: string = null;
    allRecords: DepositGuideDto[] = [];
    filteredList: DepositGuideDto[] = [];
    pagination: Pagination<DepositGuideDto> = new Pagination<DepositGuideDto>([]);

    @ViewChild("inputSearch", { static: true }) inputSearch!: ElementRef<HTMLInputElement>;

    @ViewChildren("inputFromDueDate") inputFromDueDate!: QueryList<InputDateComponent>;
    @ViewChildren("inputToDueDate") inputToDueDate!: QueryList<InputDateComponent>;
    @ViewChildren("inputFromGuideDate") inputFromGuideDate!: QueryList<InputDateComponent>;
    @ViewChildren("inputToGuideDate") inputToGuideDate!: QueryList<InputDateComponent>;
    @ViewChildren("inputMinValue") inputMinValue: QueryList<InputTextComponent>;
    @ViewChildren("inputMaxValue") inputMaxValue: QueryList<InputTextComponent>;

    override getBreadcrumbs(): PageRoute[] {
        return [new PageRoute(this.URLS.PATHS.ADMIN.INSURANCE_COMPANY.ROOT(), "Guias depósito recursal/judicial", "Guias depósito")];
    }
    constructor(
        private readonly pageService: PageService,
        private readonly spinner: NgxSpinnerService,
        private readonly notifier: NotificationService,
        private readonly adminDepositGuideService: AdminDepositGuideService,
        private readonly router: Router
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadRecords();
    }

    ngAfterViewInit(): void {
        fromEvent(this.inputSearch.nativeElement, "input")
            .pipe(
                map((event: Event) => (event.target as HTMLInputElement).value),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((searchTerm: string) => {
                this.onSearch(searchTerm);
            });
    }

    onSearch(term: string) {
        this.makeRequestToLoadDepositGuides(this.getFilters());
    }

    onClickSearchFilters() {
        this.makeRequestToLoadDepositGuides(this.getFilters());
    }

    onClearAdvancedFilter(): void {
        this.inputFromDueDate.first?.changeDate(null);
        this.inputToDueDate.first?.changeDate(null);
        this.inputFromGuideDate.first?.changeDate(null);
        this.inputToGuideDate.first?.changeDate(null);
        this.inputMinValue.first.changeValue("");
        this.inputMaxValue.first.changeValue("");

        this.makeRequestToLoadDepositGuides(null);
    }

    onExport(): void {
        this.spinner.show();
        const filter = this.getFilters();
        this.adminDepositGuideService.exportReport(filter).subscribe({
            next: (data: Blob) => {
                //todo: colocar essa função como um método da pasta utils para ser reutilizada
                const url = window.URL.createObjectURL(data);
                const link = document.createElement("a");
                link.href = url;
                link.download = "relatorio.xlsx";
                link.click();
                window.URL.revokeObjectURL(url);

                this.spinner.hide();
            },
            error: (e) => {
                this.spinner.hide();
                this.notifier.showError("Erro ao gerar reporte");
                throw e;
            },
        });
    }

    onRequestInsuranceRegistration(): void {
        if (!this.invoiceSelectedId) {
            this.notifier.showError("É preciso selecionar uma guia para poder solicitar uma proposta na seguradora");
            return;
        }

        this.adminDepositGuideService.setDepositGuideId(Number(this.invoiceSelectedId));

        this.router.navigate([this.URLS.PATHS.ADMIN.INSURANCE_COMPANY.CLIENT_CREATE(false, this.invoiceSelectedId)]);
    }

    onInvoiceSelected(id: number) {
        const selectedId = id.toString();
        this.invoiceSelectedId = selectedId;
    }

    private loadRecords(): void {
        this.makeRequestToLoadDepositGuides();
    }

    private makeRequestToLoadDepositGuides(filter?: DepositGuideFilter) {
        this.spinner.show();

        this.adminDepositGuideService.findAllDepositGuides(filter).subscribe({
            next: (data) => {
                this.allRecords = data;
                this.filteredList = this.allRecords;
                this.refreshPagination();

                this.spinner.hide();
            },
            error: (e) => {
                this.spinner.hide();
                this.notifier.showError("Erro ao carregar as guias de depósito");
                throw e;
            },
        });
    }

    private getFilters(): DepositGuideFilter {
        const fromDueDate = this.inputFromDueDate.first?.getSelectedDate();
        const toDueDate = this.inputToDueDate.first?.getSelectedDate();
        const fromGuideDate = this.inputFromGuideDate.first?.getSelectedDate();
        const toGuideDate = this.inputToGuideDate.first?.getSelectedDate();
        const minValue = this.inputMinValue.first.getValue();
        const maxValue = this.inputMaxValue.first.getValue();

        const filter: DepositGuideFilter = {
            dueDateFrom: fromDueDate,
            dueDateTo: toDueDate,
            guideDateFrom: fromGuideDate,
            guideDateTo: toGuideDate,
            minValue: minValue ? this.parseCurrency(minValue).toString() : null,
            maxValue: maxValue ? this.parseCurrency(maxValue).toString() : null,
            search: this.inputSearch.nativeElement.value.trim(),
        };

        return filter;
    }

    private refreshPagination(): void {
        this.pagination = new Pagination(this.filteredList);
    }
}
