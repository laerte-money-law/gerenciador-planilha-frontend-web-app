import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { NotificationService } from "../../../../shared/services/notification.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AdminDepositGuideService } from "src/app/admin/services/admin-deposit-guide.service";
import { DepositGuideDto, planilhaDTOMock } from "src/app/admin/models/deposit-guide.dto";
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
    allRecordsMock: planilhaDTOMock[] = []
    allRecordsMock2: planilhaDTOMock[] = []
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
       // this.makeRequestToLoadDepositGuides(this.getFilters());
    }

    onClickSearchFilters() {
     //   this.makeRequestToLoadDepositGuides(this.getFilters());
    }

    onClearAdvancedFilter(): void {
        this.inputFromDueDate.first?.changeDate(null);
        this.inputToDueDate.first?.changeDate(null);
        this.inputFromGuideDate.first?.changeDate(null);
        this.inputToGuideDate.first?.changeDate(null);
        this.inputMinValue.first.changeValue("");
        this.inputMaxValue.first.changeValue("");

       // this.makeRequestToLoadDepositGuides(null);
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
        this.allRecordsMock =[
            
            {   1: "0001720-87.2013.5.10.01",
                2:" -",
                3: "001",
                4: "0001720-87.2013.5.10.01",
                5: "12.345.678/0001-90",
                6: "01",
                7: "arquivo_001.xlsx",
                8: "PROCESSADO"
            },
            {
                1: "0001720-89.2012.5.11.01",
                2:" -",
                3: "002",
                4: "0001821-12.2014.5.03.02",
                5: "98.765.432/0001-10",
                6: "02",
                7: "arquivo_002.xlsx",
                8: "PENDENTE"
            },
            {   
                1: "0001864-89.2012.5.11.01",
                2:" -",
                3: "003",
                4: "0001922-55.2015.5.04.03",
                5: "11.222.333/0001-44",
                6: "01",
                7: "arquivo_003.xlsx",
                8: "ERRO"
            },
            {   
                1: "0001898-89.2025.5.11.01",
                2:" -",
                3: "004",
                4: "0002023-99.2016.5.02.04",
                5: "55.666.777/0001-88",
                6: "03",
                7: "arquivo_004.xlsx",
                8: "PROCESSADO"
            },
            {
                1: "0082548-89.2025.4.11.01",
                2:" -",
                3: "005",
                4: "0002124-10.2017.5.01.05",
                5: "22.333.444/0001-55",
                6: "02",
                7: "arquivo_005.xlsx",
                8: "PENDENTE"
            },
            {   
                1: "0012532-89.2025.4.21.01",
                2:" -",
                3: "006",
                4: "0002225-77.2018.5.08.06",
                5: "66.777.888/0001-99",
                6: "01",
                7: "arquivo_006.xlsx",
                8: "ATIVO"
            },
          
        ]

        this.allRecordsMock2 = [
            
            {   1: "0001720-87.2013.5.10.01",
                2:" -",
                3: "001",
                4: "0001720-87.2013.5.10.01",
                5: "12.345.678/0001-90",
                6: "01",
                7: "arquivo_001.xlsx",
                8: "FInalizado"
            },
            {
                1: "0001720-89.2012.5.11.01",
                2:" -",
                3: "002",
                4: "0001821-12.2014.5.03.02",
                5: "98.765.432/0001-10",
                6: "02",
                7: "arquivo_002.xlsx",
                8: "Finalizado"
            },
            {   
                1: "0001864-89.2012.5.11.01",
                2:" -",
                3: "003",
                4: "0001922-55.2015.5.04.03",
                5: "11.222.333/0001-44",
                6: "01",
                7: "arquivo_003.xlsx",
                8: "Finalizado"
            }
        ]
    
        //this.makeRequestToLoadDepositGuides();
    }
    /*
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
    }*/

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
