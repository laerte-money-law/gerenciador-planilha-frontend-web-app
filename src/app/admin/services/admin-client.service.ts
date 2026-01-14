import { Injectable } from "@angular/core";
import { AdminClientSaveFormDto } from "../models/forms/admin-client-save.form.dto";
import { Observable, tap } from "rxjs";
import { ClientDto } from "../models/client.dto";
import { HttpClient } from "@angular/common/http";
import { AppUrls } from "../../app.urls";
import { ClientUserDto } from "../models/client-user.dto";
import { ClientInsuranceCompanyRegistrationDto } from "../../client/models/dto/client-insurance-company-registration.dto";
import { CompanyInformationResponse } from "../models/company-information-response.dto";

@Injectable({
    providedIn: "root",
})
export class AdminClientService {
    constructor(private readonly http: HttpClient) {}

    saveClient(dto: AdminClientSaveFormDto, code: string): Observable<any> {
        if (code) {
            return this.http.put<any>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT(code), dto).pipe(tap(() => {}));
        } else {
            return this.http.post<any>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT(), dto).pipe(tap(() => {}));
        }
    }

    updateStatus(code: string): Observable<any> {
        return this.http.patch<any>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT_STATUS(code), {}).pipe(tap(() => {}));
    }

    deleteClient(code: string): Observable<any> {
        return this.http.delete<any>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT(code)).pipe(tap(() => {}));
    }

    findAllClients(): Observable<ClientDto[]> {
        return this.http.get<ClientDto[]>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT());
    }

    findByCode(code: string): Observable<ClientDto> {
        return this.http.get<ClientDto>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT(code));
    }

    findClientInsuranceCompanyRegistrations(clientCode: string): Observable<ClientInsuranceCompanyRegistrationDto[]> {
        return this.http.get<ClientInsuranceCompanyRegistrationDto[]>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT_INSURANCE_COMPANIES(clientCode));
    }

    updateRegistration(clientCode: string, insuranceCompanyRegistrationCode: string) {
        return this.http.put(AppUrls.API_ENDPOINTS.ADMIN.CLIENT_INSURANCE_COMPANIES(clientCode, insuranceCompanyRegistrationCode), null);
    }

    // ClientUser

    saveUserClient(clientCode: string, dto: ClientUserDto) {
        if (dto.code) {
            return this.http.put(AppUrls.API_ENDPOINTS.ADMIN.CLIENT_USERS_MANAGEMENT(clientCode, dto.code), dto);
        } else {
            return this.http.post(AppUrls.API_ENDPOINTS.ADMIN.CLIENT_USERS_MANAGEMENT(clientCode), dto);
        }
    }

    updateStatusClientUser(code: string, userCode: string): Observable<any> {
        return this.http.patch<any>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT_USER_STATUS(code, userCode), {}).pipe(tap(() => {}));
    }

    deleteClientUser(code: string, userCode: string) {
        return this.http.delete<any>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT_USERS_MANAGEMENT(code, userCode)).pipe(tap(() => {}));
    }

    findAllClientUser(clientCode: string): Observable<ClientUserDto[]> {
        return this.http.get<ClientUserDto[]>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT_USERS_MANAGEMENT(clientCode));
    }

    findClientUserByCode(userCode: string): Observable<ClientUserDto> {
        return this.http.get<ClientUserDto>(AppUrls.API_ENDPOINTS.ADMIN.CLIENT_USERS_MANAGEMENT(userCode));
    }

    findCompanyInformationInExternalService(cnpj: string): Observable<any> {
        return this.http.get<CompanyInformationResponse>(AppUrls.API_ENDPOINTS.RECEITAWS.COMPANY_INFORMATION(cnpj)).pipe(tap(() => {}));
    }
}
