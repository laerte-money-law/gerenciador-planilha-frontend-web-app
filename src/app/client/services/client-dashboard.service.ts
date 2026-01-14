import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppUrls } from "src/app/app.urls";
import { map, Observable } from "rxjs";

/** ===== CARDS ===== */
export interface ClientDashboardCardsDto {
  totalPremiumAmount: number;
  totalActivePoliciesInsuredAmount: number;
  totalActivePolicies: number;
}

/** ===== OVERVIEW ===== */
export interface DonutRaw {
  status: "ok" | "error";
  data: { labels: string[]; series: number[] };
}
export interface CreditLimitUsagePoint { x: string; y: number; }
export interface CreditLimitUsageSeries {
  name: string; // "Crédito Utilizado" | "Crédito Restante"
  data: CreditLimitUsagePoint[];
}
export interface CreditLimitUsageRaw {
  status: "ok" | "error";
  data: {
    categories: string[];
    series: CreditLimitUsageSeries[];
    meta: Array<{ insurer: string; hasCreditLimit: boolean }>;
  };
}
export interface DashboardOverviewRaw {
  policiesByInsurer: DonutRaw;
  activeInactive: DonutRaw;
  creditLimitUsage: CreditLimitUsageRaw;
}

/** ===== PROCESSOS ===== */
export interface RawProcessItem {
  processNumber: string | null;
  insuredValue: number;
  status: string | null;
  lastUpdate: string | null;
  insuranceCompany: string | null;
}
export interface ProcessesPage {
  data: RawProcessItem[];
  meta: {
    page: number; limit: number; itemCount: number; totalItems: number; pageCount: number;
    hasPrevPage: boolean; hasNextPage: boolean;
  };
}
export interface ProcessDashboardDTO {
  insuranceCompanyName: string;
  processNumber: string;
  processStatus: string;
  processDischargeDate:any
  insuredValue: number;
}
export interface ProcessesTablePage {
  rows: ProcessDashboardDTO[];
  meta: ProcessesPage["meta"];
}

@Injectable({ providedIn: "root" })
export class ClientDashboardService {
  constructor(private readonly http: HttpClient) {}

  /** Cards do topo */
  getCardsInfo(): Observable<ClientDashboardCardsDto> {
    return this.http.get<ClientDashboardCardsDto>(
      AppUrls.API_ENDPOINTS.CLIENT.DASHBOARD.CARDSINFO()
    );
  }

  /** Overview (gráficos) */
  getOverview(): Observable<DashboardOverviewRaw> {
    return this.http.get<DashboardOverviewRaw>(
      AppUrls.API_ENDPOINTS.CLIENT.DASHBOARD.OVERVIEW()
    );
  }

  /** Processos (paginado) */
  getProcesses(page = 1, limit = 15): Observable<ProcessesPage> {
    const params = new HttpParams().set("page", String(page)).set("limit", String(limit));
    return this.http.get<ProcessesPage>(AppUrls.API_ENDPOINTS.CLIENT.DASHBOARD.PROCESS(), { params });
  }

  /** Adaptado para a tabela (linhas + meta) */
  getProcessesTablePage(page = 1, limit = 15): Observable<ProcessesTablePage> {
    return this.getProcesses(page, limit).pipe(
      map(resp => ({
        rows: (resp.data ?? []).map<ProcessDashboardDTO>(p => ({
          insuranceCompanyName: p.insuranceCompany ?? "-",
          processNumber:        p.processNumber     ?? "-",
          processStatus:        p.status            ?? "-",
          policyStatus:         "",
          processDischargeDate: p.lastUpdate,
          insuredValue:         p.insuredValue ?? 0,
        })),
        meta: resp.meta
      }))
    );
  }
}
