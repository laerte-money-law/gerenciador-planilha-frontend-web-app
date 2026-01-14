import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppUrls } from "../../app.urls";
import { ClientInsuranceCompanyRegistrationDto } from "../models/dto/client-insurance-company-registration.dto";
import { DepositGuideDto } from "src/app/admin/models/deposit-guide.dto";
import { InsuranceCompanyDto } from "src/app/admin/models/insurance-company.dto";

@Injectable({
    providedIn: "root",
})
export class ClientInsuranceCompanyService {
    private clientCode: string = null;
    private selectedInsuranceCompanies: ClientInsuranceCompanyRegistrationDto[] = [];
    private depositGuide: DepositGuideDto = null;

    constructor(private readonly http: HttpClient) {}

    findAllClientInsuranceCompaniesResgitrations(clientCode: string): Observable<ClientInsuranceCompanyRegistrationDto[]> {
        return this.http.get<ClientInsuranceCompanyRegistrationDto[]>(
            AppUrls.API_ENDPOINTS.CLIENT.GET_INSURANCE_COMPANY_REGISTRATIONS(clientCode)
        );
    }

    setInsuranceCompaniesSelected(codes: ClientInsuranceCompanyRegistrationDto[]): void {
        this.selectedInsuranceCompanies = codes;
    }

    setClientCode(clientCode: string): void {
        this.clientCode = clientCode;
    }

    getInsuranceCompaniesSelected(): ClientInsuranceCompanyRegistrationDto[] {
        return this.selectedInsuranceCompanies;
    }

    getClientCode(): string {
        return this.clientCode;
    }

    setDepositGuide(depositGuide: DepositGuideDto): void {
        this.depositGuide = depositGuide;
    }

    getDepositGuide(): DepositGuideDto {
        return this.depositGuide;
    }

    downloadCertificate(registrationCode: string, type: "admin" | "susep"): Observable<any> {
        return this.http.get<any>(AppUrls.API_ENDPOINTS.CLIENT.INSURANCE_COMPANIES_CERTIFICATE(registrationCode, type));
    }

    updateRegistration(insuranceCompanyRegistrationCode: string, clientCode: string) {
        return this.http.put(
            AppUrls.API_ENDPOINTS.CLIENT.UPDATE_INSURANCE_COMPANY_REGISTRATIONS(insuranceCompanyRegistrationCode, clientCode),
            null
        );
    }

    findAll(): Observable<InsuranceCompanyDto[]> {
        return this.http.get<InsuranceCompanyDto[]>(AppUrls.API_ENDPOINTS.CLIENT.GET_ALL_INSURANCE_COMPANIES());
    }
}   

