import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppUrls } from "src/app/app.urls";
import { ClientQuotationContext, ClientQuotationsDto } from "src/app/client/models/dto/client-insurance-company-quotation.dto";
import { PaginationMetaDto } from "src/app/shared/models/pagination-metadata.dto";

interface AdminClientQuotationsResponseDto {
  data: ClientQuotationsDto[];
  meta: PaginationMetaDto;
}

@Injectable({
    providedIn: "root",
})
export class AdminQuotationService {
    private clientCode: string;
    private insuredCode: string;
    private quotationCode: string;

    constructor(private readonly http: HttpClient) {}

    findAllClientQuotations(params: {
        limit: number;
        page: number;
    }): Observable<AdminClientQuotationsResponseDto> {
        const httpParams = new HttpParams()
        .set("page", params.page.toString())
        .set("limit", params.limit.toString());

        return this.http.get<AdminClientQuotationsResponseDto>(
            AppUrls.API_ENDPOINTS.ADMIN.QUOTATIONS(),
            { params: httpParams }
        );
    }
    

    findQuotationUpdateInformation(quotationCode: string): Observable<any> {
        return this.http.get<any>(AppUrls.API_ENDPOINTS.ADMIN.QUOTATION_UPDATE_INFO(quotationCode));
    }

    updateQuotationPremium(quotationCode: string, dto): Observable<any> {
        return this.http.put<any>(AppUrls.API_ENDPOINTS.ADMIN.QUOTATION_UPDATE_PREMIUM(quotationCode), dto);
    }

    setQuotationContext(clientCode: string, insuredCode: string, quotationCode: string): void {
        this.clientCode = clientCode;
        this.insuredCode = insuredCode;
        this.quotationCode = quotationCode;
    }

    getQuotationContext(): ClientQuotationContext {
        return {
            clientCode: this.clientCode,
            insuredCode: this.insuredCode,
            quotationCode: this.quotationCode,
        };
    }
}
