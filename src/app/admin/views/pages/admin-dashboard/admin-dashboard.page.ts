import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseAppPageView } from "../../../../shared/views/base-app-page.view";
import { PageService } from "../../../../shared/services/page.service";
import { PageRoute } from "../../../../shared/models/page-route";
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
    ApexStroke,
    ApexLegend,
    ChartComponent,
    ApexOptions,
    ApexTitleSubtitle,
} from "ng-apexcharts";
import { ClientsPoliciesChartOptions } from "../../../../client/views/pages/client-dashboard/client-dashboard.page";

export type DepositChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    colors: string[];
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
};

@Component({
    selector: "admin-dashboard-page",
    templateUrl: "./admin-dashboard.page.html",
    styles: ``,
})
export class AdminDashboardPage extends BaseAppPageView implements OnInit {
    @ViewChild("deposits-chart") depositsChart: ChartComponent;
    public depositsChartOptions: Partial<DepositChartOptions>;

    @ViewChild("clients-policies-chart") clientsPoliciesChart: ChartComponent;
    public clientsPoliciesChartOptions: Partial<ClientsPoliciesChartOptions>;

    override getBreadcrumbs(): PageRoute[] {
        return [new PageRoute(this.URLS.PATHS.ADMIN.DASHBOARD(), "Dashboard", "Dashboard")];
    }
    constructor(private readonly pageService: PageService) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());

        this.loadCharts();
    }

    private loadCharts(): void {
        this.depositsChartOptions = {
            series: [
                {
                    name: "Total",
                    data: [
                        16476, 63202, 18469, 116019, 305321, 166915, 265847, 138446, 224126, 106916, 178650, 122628, 682786, 215936, 70292,
                        487931, 193307, 56391, 753824, 71577, 470942, 51599, 16024, 349275, 45410, 2377639, 43650,
                    ],
                },
            ],
            chart: {
                type: "bar",
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    // endingShape: "rounded",
                },
            },

            dataLabels: {
                enabled: false,
            },
            colors: ["#266954"],
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
            },
            xaxis: {
                categories: [
                    "AC",
                    "AL",
                    "AP",
                    "AM",
                    "BA",
                    "CE",
                    "DF",
                    "ES",
                    "GO",
                    "MA",
                    "MT",
                    "MS",
                    "MG",
                    "PA",
                    "PB",
                    "PR",
                    "PE",
                    "PI",
                    "RJ",
                    "RN",
                    "RS",
                    "RO",
                    "RR",
                    "SC",
                    "SE",
                    "SP",
                    "TO",
                ],
            },
            yaxis: {
                title: {
                    text: "Valor total em R$",
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "R$ " + val;
                    },
                },
            },
        };

        this.clientsPoliciesChartOptions = {
            series: [
                {
                    name: "Income",
                    type: "column",
                    data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
                },
                {
                    name: "Cashflow",
                    type: "column",
                    data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5],
                },
                {
                    name: "Revenue",
                    type: "line",
                    data: [20, 29, 37, 36, 44, 45, 50, 58],
                },
            ],
            chart: {
                height: 350,
                type: "line",
                stacked: false,
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: [1, 1, 4],
            },
            title: {
                // text: "XYZ - Stock Analysis (2009 - 2016)",
                align: "left",
                offsetX: 110,
            },
            xaxis: {
                categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
            },
            yaxis: [
                {
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: "#008FFB",
                    },
                    labels: {
                        style: {
                            colors: "#008FFB",
                        },
                    },
                    title: {
                        text: "Income (thousand crores)",
                        style: {
                            color: "#008FFB",
                        },
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
                {
                    seriesName: "Income",
                    opposite: true,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: "#00E396",
                    },
                    labels: {
                        style: {
                            colors: "#00E396",
                        },
                    },
                    title: {
                        text: "Operating Cashflow (thousand crores)",
                        style: {
                            color: "#00E396",
                        },
                    },
                },
                {
                    seriesName: "Revenue",
                    opposite: true,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: "#FEB019",
                    },
                    labels: {
                        style: {
                            colors: "#FEB019",
                        },
                    },
                    title: {
                        text: "Revenue (thousand crores)",
                        style: {
                            color: "#FEB019",
                        },
                    },
                },
            ],
            tooltip: {
                fixed: {
                    enabled: true,
                    position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
                    offsetY: 30,
                    offsetX: 60,
                },
            },
            legend: {
                horizontalAlign: "left",
                offsetX: 40,
            },
        };
    }
}
