import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageRoute } from "../../../../shared/models/page-route";
import { PageService } from "../../../../shared/services/page.service";
import {
  ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries,
  ApexPlotOptions, ApexResponsive, ApexStroke, ApexTheme, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent
} from "ng-apexcharts";
import {
  ClientDashboardService,
  ClientDashboardCardsDto,
  DashboardOverviewRaw,
  ProcessDashboardDTO
} from "src/app/client/services/client-dashboard.service";
import { NgbDatepicker, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { RemotePagination } from "src/app/shared/services/remote-pagination";
import { C } from "@fullcalendar/core/internal-common";

export type ClientsPoliciesChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any;
  stroke: any;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

export type ChartDonutsOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  theme: ApexTheme;
  labels: any;
  legend: ApexLegend;
};

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  stroke: ApexStroke;
  title?: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  theme?: ApexTheme;
  colors?: string[];
  responsive: ApexResponsive[];

};

@Component({
  selector: "client-dashboard-page",
  templateUrl: "./client-dashboard.page.html",
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientDashboardPage extends BaseAppPageView implements OnInit {
  @ViewChild("clients-policies-chart") clientsPoliciesChart: ChartComponent;
  public clientsPoliciesChartOptions: Partial<ClientsPoliciesChartOptions>;

  @ViewChild("policies-by-insurance-company-chart") policiesByInsuranceCompanyChart: ChartComponent;
  public policiesByInsuranceCompanyChartOptions: Partial<ChartDonutsOptions>;

  @ViewChild("policies-by-broker-chart") policiesByBrokerChart: ChartComponent;
  public policiesByBrokerChartOptions: Partial<ChartDonutsOptions>;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("miniCalendar", { static: false }) miniCalendar: NgbDatepicker;
  selectedDate: NgbDateStruct = this.fromDate(new Date());

  // === ESTADOS ===
  cards?: ClientDashboardCardsDto;
  processesDashboardList: ProcessDashboardDTO[] = [];
  processesLoading = false;
  processesMeta = {
    page: 1,
    limit: 15,
    totalItems: 0,
    pageCount: 1,
    hasPrevPage: false,
    hasNextPage: false
  };

  pagination: RemotePagination<ProcessDashboardDTO>;

  override getBreadcrumbs(): PageRoute[] {
    return [new PageRoute(this.URLS.PATHS.CLIENT.DASHBOARD(), "Dashboard", "Dashboard")];
  }

  constructor(
    private readonly pageService: PageService,
    private readonly clientDashboardService: ClientDashboardService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super();
    this.pagination = new RemotePagination<ProcessDashboardDTO>((page) => {
      this.loadProcesses(page, this.processesMeta.limit);
    });
  }


  ngOnInit(): void {
    this.pageService.setToolbar(this.getBreadcrumbs());
    this.loadAll();
  }


  /** Carrega tudo do back */
  private loadAll(): void {
    // CARDS
    this.clientDashboardService.getCardsInfo().subscribe({
      next: (c) => { this.cards = c; this.cdr.markForCheck(); },
      error: (e) => { console.error('cards error', e); this.cdr.markForCheck(); }
    });

    // OVERVIEW
    this.clientDashboardService.getOverview().subscribe({
      next: (o) => { this.setOverviewCharts(o); this.cdr.markForCheck(); },
      error: (e) => { console.error('overview error', e); this.cdr.markForCheck(); }
    });

    // PROCESSOS (página 1, limite 15)
    this.loadProcesses(this.processesMeta.page, this.processesMeta.limit);
  }

  loadProcesses(page: number, limit: number) {
    this.processesLoading = true;
    this.clientDashboardService.getProcessesTablePage(page, limit).subscribe({
      next: (resp) => {
        this.processesDashboardList = resp.rows ?? [];
        this.processesDashboardList = this.processesDashboardList.map(p => { return { ...p, processDischargeDate: new Date(this.getRandomDate(new Date(2023, 0, 1), new Date(2025, 11, 31))) } })
        this.processesMeta = { ...this.processesMeta, ...resp.meta, limit };
        this.pagination.sync(resp.rows, resp.meta);
        this.cdr.markForCheck();
      },
      error: () => {
        this.processesDashboardList = [];
        this.cdr.markForCheck();
      },
      complete: () => (this.processesLoading = false)
    });
  }

  getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  onProcessPageChange(nextPage: number) {
    this.loadProcesses(nextPage, this.processesMeta.limit);
  }

  onProcessPageSizeChange(nextSize: number) {
    this.processesMeta.limit = Number(nextSize);
    this.loadProcesses(1, this.processesMeta.limit); // back to page 1
  }


  private setOverviewCharts(overview: DashboardOverviewRaw) {
    // Donut: Apólices por Seguradora
    const insurers = overview?.policiesByInsurer?.data;

    this.policiesByInsuranceCompanyChartOptions = {
      series: insurers?.series ?? [],
      chart: { type: "donut", height: 350 },
      labels: insurers?.labels ?? [],
      theme: { monochrome: { enabled: true, color: "#0A3325" } },
      legend: { position: "bottom", horizontalAlign: "center" },
      responsive: []
    };

    // Pie: Processos (Ativos x Encerrados)
    const proc = overview?.activeInactive?.data;
    this.policiesByBrokerChartOptions = {
      series: proc?.series ?? [],
      chart: { type: "pie", height: 350 },
      labels: proc?.labels ?? [],
      theme: { monochrome: { enabled: true, color: "#0A3325" } },
      legend: { position: "bottom", horizontalAlign: "center" },
      responsive: []
    };

    /*/ Barra empilhada: Painel de Crédito
    const credit = overview?.creditLimitUsage?.data;
    if (credit) {
      const truncate = (s: string, max = 26) => (s?.length > max ? s.slice(0, max) + '…' : s);
  
      // ==== normaliza + ordena por "Crédito Utilizado" desc ====
      const usedSeries = credit.series.find(s => s.name?.toLowerCase().includes('utilizado'))?.data ?? [];
      const remainingSeries = credit.series.find(s => s.name?.toLowerCase().includes('restante'))?.data ?? [];
  
      // índice por seguradora
      const usedMap = new Map<string, number>(usedSeries.map(d => [d.x, d.y]));
      const remMap = new Map<string, number>(remainingSeries.map(d => [d.x, d.y]));
  
      const categories = Array.from(new Set([...usedMap.keys(), ...remMap.keys()]));
      categories.sort((a, b) => (usedMap.get(b) ?? 0) - (usedMap.get(a) ?? 0));
  
      var rebuiltUsed = categories.map(name => ({ x: name, y: usedMap.get(name) ?? 0 }));
      var rebuiltRem = categories.map(name => ({ x: name, y: remMap.get(name) ?? 0 }));
  
      const companiesToDisplay = rebuiltRem.filter(item => item.y > 0).map(item => item.x);
      console.log(companiesToDisplay)
  
      rebuiltRem = rebuiltRem.filter(item => companiesToDisplay.includes(item.x))
      rebuiltUsed = rebuiltUsed.filter(item => companiesToDisplay.includes(item.x))
  
      // ==== dinamic height ====
      const rowHeight = 34;
      const minHeight = 360;
      const dynamicHeight = Math.max(minHeight, categories.length * rowHeight);
  
      const fmtBRL = (n: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
  
      this.chartOptions = {
        series: [
          { name: 'Crédito Utilizado', data: rebuiltUsed },
          { name: 'Crédito Restante', data: rebuiltRem },
        ],
        chart: {
          type: 'bar',
          height: dynamicHeight,
          width: '100%',
          stacked: true,
          fontFamily: 'Montserrat'
        },
  
        plotOptions: { bar: { horizontal: true, barHeight: '70%' } },
        xaxis: {
          categories,
          labels: { show: false },
        },
        yaxis: {
          labels: { formatter: (val) => truncate(val.toString(), 26) }
        },
        stroke: { width: 1, colors: ['#fff'] },
        fill: { opacity: 1 },
        legend: { position: 'bottom' },
        tooltip: {
          y: { formatter: (val: number) => fmtBRL(val) },
          x: {
            formatter: (_: any, opts: any) => {
              const i = opts?.dataPointIndex ?? 0;
              return categories[i] ?? _;
            },
          },
        },
        responsive: [],
        dataLabels: {
          enabled: true,
          formatter: (val: number) => fmtBRL(val),
        }
      }
    }*/

    const categories = ["AKAD", "AVLA", "POTENCIAL", "TOKIO", "JUNTO"];
    const palette = ["#0A3325", "#14513C", "#1B6A50", "#228365", "#299C7A"];

    this.chartOptions = {
      series: [
        {
          name: "Crédito Utilizado",
          data: [300, 450, 500, 400, 350].map((y, i) => ({
            x: categories[i],
            y,
            fillColor: palette[i],
          })),
        },
        {
          name: "Crédito Restante",
          data: [500, 500, 600, 500, 400].map((y, i) => ({
            x: categories[i],
            y,
            fillColor: palette[i],
          })),
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        width: "100%",
        stacked: true,
        fontFamily: "Montserrat",
      },
      plotOptions: { bar: { horizontal: true } }, // ⛔ remove `distributed`
      xaxis: { categories }, // optional when using x in data
      stroke: { width: 1, colors: ["#fff"] },
      tooltip: { y: { formatter: (val) => `${val}K` } },
      fill: { opacity: 1 },
      legend: {
        show: false,
      },
    };


  }

  fromDate(date: Date): NgbDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }
  onDaySelect(date: NgbDateStruct): void {
    this.selectedDate = date;
  }


  hasChartData(options: any): boolean {
    if (!options || !Array.isArray(options.series)) return false;
    const s = options.series;

    if (typeof s[0] === 'number') {
      const nums = s as number[];
      const total = nums.reduce((acc, n) => acc + (Number(n) || 0), 0);
      const hasLabels = Array.isArray(options.labels) ? options.labels.length > 0 : true;
      return hasLabels && nums.length > 0 && total > 0;
    }

    const allPoints = s.flatMap((serie: any) =>
      Array.isArray(serie?.data) ? serie.data : []
    );
    const total = allPoints.reduce((acc: number, p: any) => acc + (Number(p?.y) || 0), 0);

    const hasCategories = Array.isArray(options?.xaxis?.categories)
      ? options.xaxis.categories.length > 0
      : true;

    return hasCategories && allPoints.length > 0 && total > 0;
  }


}
