import { Injectable } from "@angular/core";
import { AdminConsultantSaveFormDto } from "../models/forms/admin-consultant-save.form.dto";
import { Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AppUrls } from "../../app.urls";
import { ConsultantDto } from "../models/consultant.dto";

@Injectable({
    providedIn: "root",
})
export class AdminConsultantService {
    constructor(private readonly http: HttpClient) {}

    saveConsultant(dto: AdminConsultantSaveFormDto, code: string): Observable<any> {
        if (code) {
            return this.http.put<any>(AppUrls.API_ENDPOINTS.ADMIN.CONSULTANT(code), dto).pipe(
                tap(() => {
                    // PregnancyService.forceRefreshCache();
                })
            );
        } else {
            return this.http.post<any>(AppUrls.API_ENDPOINTS.ADMIN.CONSULTANT(), dto).pipe(
                tap(() => {
                    // PregnancyService.forceRefreshCache();
                })
            );
        }
    }

    updateStatus(code: string): Observable<any> {
        return this.http.patch<any>(AppUrls.API_ENDPOINTS.ADMIN.CONSULTANT_STATUS(code), {}).pipe(
            tap(() => {
                // PregnancyService.forceRefreshCache();
            })
        );
    }

    deleteConsultant(code: string) {
        return this.http.delete<any>(AppUrls.API_ENDPOINTS.ADMIN.CONSULTANT(code)).pipe(
            tap(() => {
                // PregnancyService.forceRefreshCache();
            })
        );
    }

    findByCode(code: string) {
        return this.http.get<ConsultantDto>(AppUrls.API_ENDPOINTS.ADMIN.CONSULTANT(code));
    }

    findAllConsultants(): Observable<ConsultantDto[]> {
        return this.http.get<ConsultantDto[]>(AppUrls.API_ENDPOINTS.ADMIN.CONSULTANT());
    }
}
