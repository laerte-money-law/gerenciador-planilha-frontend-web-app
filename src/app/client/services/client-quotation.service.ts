import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppUrls } from "../../app.urls";
import { ClientQuotationRequestFormDto } from "../models/forms/client-quotation-request.form.dto";
import { Observable } from "rxjs";
import { ClientQuotationsDto } from "../models/dto/client-insurance-company-quotation.dto";
import { PaginationMetaDto } from "src/app/shared/models/pagination-metadata.dto";

export interface ClientQuotationsResponseDto {
  data: ClientQuotationsDto[];
  meta: PaginationMetaDto;
}

@Injectable({
    providedIn: "root",
})
export class ClientQuotationService {
    constructor(private readonly http: HttpClient) {}

     findAllClientQuotations(
        clientCode: string,
        params: { limit: number; page: number }
    ): Observable<ClientQuotationsResponseDto> {
        const httpParams = new HttpParams()
            .set("page", params.page.toString())
            .set("limit", params.limit.toString());

        return this.http.get<ClientQuotationsResponseDto>(
            AppUrls.API_ENDPOINTS.CLIENT.QUOTATIONS(clientCode),
            { params: httpParams }
        );
    }

    sendQuotationRequest(dto: ClientQuotationRequestFormDto): Observable<any> {
        return this.http.post<any>(AppUrls.API_ENDPOINTS.CLIENT.ADD_QUOTATIONS(), dto);
    }

    getQuotationDocument(insuredCode: string, insuranceCompanyRegistrationCode: string): Observable<any> {
        return this.http.get<any>(AppUrls.API_ENDPOINTS.CLIENT.QUOTATION_DOCUMENT(insuredCode, insuranceCompanyRegistrationCode));
    }

    getProposalBankSlip(insuredDocument: string) {
        return this.http.get<any>(AppUrls.API_ENDPOINTS.CLIENT.PROPOSAL_BANK_SLIP(insuredDocument));
    }

    getQuotationDetails(insuredCode: string): Observable<any> {
        return this.http.get<ClientQuotationsDto[]>(AppUrls.API_ENDPOINTS.CLIENT.QUOTATION_DETAIL(insuredCode));
    }

    acceptProposal(clientCode: string, insuredCode: string, insuranceCompanyRegistrationCode: string): Observable<any> {
        return this.http.post<any>(
            AppUrls.API_ENDPOINTS.CLIENT.QUOTATION_PROPOSAL_ACCEPT(clientCode, insuredCode, insuranceCompanyRegistrationCode),
            null
        );
    }

    deleteQuotation(insuredCode: string) {
        return this.http.delete<any>(AppUrls.API_ENDPOINTS.CLIENT.QUOTATION_DETAIL(insuredCode));
    }

    getCourtNames(processNumber: string): Observable<any> {
        return this.http.get<any>(AppUrls.API_ENDPOINTS.CLIENT.COURT_NAMES(processNumber));
    }
}
