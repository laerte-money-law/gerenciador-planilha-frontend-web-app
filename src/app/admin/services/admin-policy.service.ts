import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AppUrls } from "src/app/app.urls";
import { InsurancePolicyFormDto } from "../models/forms/admin-policy-save.form.dto";
import { ClientPolicyDto } from "src/app/client/models/dto/client-policy.dto";

@Injectable({
    providedIn: "root",
})
export class AdminPolicyService {
    constructor(private readonly http: HttpClient) {}

    createPolicy(dto: InsurancePolicyFormDto): Observable<any> {
        return this.http.post<any>(AppUrls.API_ENDPOINTS.ADMIN.ADD_POLICY(), dto).pipe(tap(() => {}));
    }

    findAllPolicies(): Observable<ClientPolicyDto[]> {
        return this.http.get<any>(AppUrls.API_ENDPOINTS.ADMIN.GET_POLICIES());
    }
}
