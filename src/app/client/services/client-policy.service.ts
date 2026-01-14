import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppUrls } from "../../app.urls";
import { ClientPolicyDto } from "../models/dto/client-policy.dto";
import { PaginationMetaDto } from "src/app/shared/models/pagination-metadata.dto";
import { AgendaItemDto } from "../models/dto/agenda-item.dto";
import { start } from "@popperjs/core";

export type AgendaFilter = 'dueOnDay' | 'all' | 'upcoming' | 'overdue';
export interface AgendaResponseDto {
  data: AgendaItemDto[];
  meta: PaginationMetaDto;
}

@Injectable({
    providedIn: "root",
})

export class ClientPolicyService {
    constructor(private readonly http: HttpClient) {}

    getPolicyDetails(insuredDocuemt: string, policyNumber: string): Observable<any> {
        return this.http.get<ClientPolicyDto>(AppUrls.API_ENDPOINTS.CLIENT.POLICY_DETAILS(insuredDocuemt, policyNumber));
    }

    getAllPolicies(clientCode: string): Observable<any> {
        return this.http.get<ClientPolicyDto[]>(AppUrls.API_ENDPOINTS.CLIENT.POLICIES(clientCode));
    }

    getPolicyBankSlipDocument(insuredDocument: string, policyNumber: string) {
        return this.http.get<any>(AppUrls.API_ENDPOINTS.CLIENT.POLICY_BANK_SLIP_DOCUMENT(insuredDocument, policyNumber));
    }

    getPolicyDocument(insuredDocument: string, policyNumber: string) {
        return this.http.get<any>(AppUrls.API_ENDPOINTS.CLIENT.POLICY_DOCUMENT(insuredDocument, policyNumber));
    }

    getAgenda(
        clientCode: string,
        params: { limit: number; page: number; date: string; filter: AgendaFilter }
        ) {
    return this.http.get<AgendaResponseDto>(
        AppUrls.API_ENDPOINTS.CLIENT.AGENDA(clientCode),
        {
        params: {
                limit: params.limit.toString(),
                page: params.page.toString(),
                date: params.date,
                filter: params.filter
            }
        }
    )}
    getAgendaRange(
        clientCode: string,
        params: { startDate: string; endDate: string }
    ) {
        return this.http.get<AgendaResponseDto>(
        AppUrls.API_ENDPOINTS.CLIENT.AGENDA_RANGE(clientCode),
        { params: {
            startDate: params.startDate,
            endDate: params.endDate
        } }
        );
    }
}
export { AgendaItemDto };

