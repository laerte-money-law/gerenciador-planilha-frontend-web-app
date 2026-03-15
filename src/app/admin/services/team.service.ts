import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppUrls } from "src/app/app.urls";
import { HttpClient, HttpParams } from "@angular/common/http";
import { TeamDto } from "../models/spreadsheet.dto";

@Injectable({
  providedIn: "root",
})
export class TeamService {

  constructor(private readonly http: HttpClient) {}

  findAllTeams(clientId?: number): Observable<TeamDto[]> {
    let params = new HttpParams();
    if (clientId) {
      params = params.set("clientId", String(clientId));
    }
    return this.http.get<TeamDto[]>(
      AppUrls.API_ENDPOINTS.ADMIN.TEAMS_LIST(),
      { params }
    );
  }

  createTeam(name: string, clientId?: number): Observable<TeamDto> {
    return this.http.post<TeamDto>(
      AppUrls.API_ENDPOINTS.ADMIN.TEAMS_LIST(),
      { name, clientId }
    );
  }
}