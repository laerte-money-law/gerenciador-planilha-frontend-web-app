import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AppUrls } from "../../app.urls";
import {
    AdminInsuranceCompanySaveFormDto,
    AdminInsuranceCompanytCreateFormDto,
} from "../models/forms/admin-insurance-company-save.form.dto";
import { InsuranceCompanyDetailsDto, InsuranceCompanyDto } from "../models/insurance-company.dto";

@Injectable({
    providedIn: "root",
})
export class AdminInsuranceCompanyService {
    constructor(private readonly http: HttpClient) {}

    create(dto: AdminInsuranceCompanytCreateFormDto): Observable<InsuranceCompanyDto> {
        return this.http.post<InsuranceCompanyDto>(AppUrls.API_ENDPOINTS.ADMIN.INSURANCE_COMPANIES(), dto);
    }

    save(dto: AdminInsuranceCompanySaveFormDto, code: string): Observable<InsuranceCompanyDto> {
        return this.http.put<InsuranceCompanyDto>(AppUrls.API_ENDPOINTS.ADMIN.INSURANCE_COMPANIES(code), dto).pipe(
            tap(() => {
                // PregnancyService.forceRefreshCache();
            })
        );
    }

    updateStatus(code: string): Observable<InsuranceCompanyDto> {
        return this.http.patch<InsuranceCompanyDto>(AppUrls.API_ENDPOINTS.ADMIN.INSURANCE_COMPANIES_STATUS(code), {}).pipe(
            tap(() => {
                // PregnancyService.forceRefreshCache();
            })
        );
    }

    downloadCertificate(registrationCode: string, certificateType: "susep" | "admin"): Observable<any> {
        return this.http.get<any>(AppUrls.API_ENDPOINTS.ADMIN.INSURANCE_COMPANIES_CERTIFICATE(registrationCode, certificateType));
    }

    deleteCertificate(registrationCode: string, type: "susep" | "admin"): Observable<any> {
        return this.http.delete<any>(AppUrls.API_ENDPOINTS.ADMIN.INSURANCE_COMPANIES_CERTIFICATE(registrationCode, type));
    }

    findByCode(code: string) {
        return this.http.get<InsuranceCompanyDetailsDto>(AppUrls.API_ENDPOINTS.ADMIN.INSURANCE_COMPANIES(code));
    }

    findAll(): Observable<InsuranceCompanyDto[]> {
        return this.http.get<InsuranceCompanyDto[]>(AppUrls.API_ENDPOINTS.ADMIN.INSURANCE_COMPANIES());
    }
}
