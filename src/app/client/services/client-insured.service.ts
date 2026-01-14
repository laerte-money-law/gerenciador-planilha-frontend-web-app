import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppUrls } from "../../app.urls";
import { ClientPolicyDto } from "../models/dto/client-policy.dto";
import { InsuredSaveInputDto } from "../models/dto/insured-save-input.dto";

@Injectable({
    providedIn: "root",
})
export class ClientInsuredService {
    constructor(private readonly http: HttpClient) {}

    getInsureds(): Observable<any> {
        return this.http.get<ClientPolicyDto>(AppUrls.API_ENDPOINTS.CLIENT.INSURED());
    }

    createInsured(dto: InsuredSaveInputDto): Observable<any> {
        return this.http.post<InsuredSaveInputDto>(AppUrls.API_ENDPOINTS.CLIENT.INSURED(), dto);
    }
}
