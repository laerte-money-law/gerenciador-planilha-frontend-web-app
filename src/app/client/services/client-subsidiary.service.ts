import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppUrls } from "src/app/app.urls";
import { ClientSubsidiaryDto } from "../models/dto/client-subsidiaries.dto";

@Injectable({
    providedIn: "root",
})
export class ClientSubsidiaryService {
    constructor(private readonly http: HttpClient) {}

    findAllSubsidiaries(clientCode: string): Observable<any[]> {
        return this.http.get<ClientSubsidiaryDto[]>(AppUrls.API_ENDPOINTS.CLIENT.SUBSIDIARIES(clientCode));
    }
}
