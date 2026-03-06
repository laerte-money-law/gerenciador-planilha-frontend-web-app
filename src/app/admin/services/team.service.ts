import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppUrls } from "src/app/app.urls";
import { HttpClient } from "@angular/common/http";
import { TeamDto } from "../models/spreadsheet.dto";

@Injectable({
  providedIn: "root",
})
export class TeamService {

  constructor(private readonly http: HttpClient) {}

  findAllTeams(): Observable<TeamDto[]> {
    return this.http.get<TeamDto[]>(
      AppUrls.API_ENDPOINTS.ADMIN.TEAMS_LIST()
    );
  }

  createTeam(name: string): Observable<TeamDto> {
    return this.http.post<TeamDto>(
      AppUrls.API_ENDPOINTS.ADMIN.TEAMS_LIST(),
      { name }
    );
  }
}