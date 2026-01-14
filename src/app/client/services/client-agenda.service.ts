import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ClientAgendaEventDto } from "../models/dto/client-agenda-event.dto";
import { AppUrls } from "src/app/app.urls";

@Injectable({
    providedIn: "root",
})
export class ClientAgendaService {
    constructor(private readonly http: HttpClient) {}

    getAgendaEvents(clientCode: string): Observable<any> {
        return this.http.get<ClientAgendaEventDto>(AppUrls.API_ENDPOINTS.CLIENT.AGENDA(clientCode));
    }
}
