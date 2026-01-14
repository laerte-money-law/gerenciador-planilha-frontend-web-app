import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppUrls } from "src/app/app.urls";
import { DepositGuideFilter } from "../models/admin-deposit-guide-query-params.dto";

@Injectable({
    providedIn: "root",
})
export class AdminDepositGuideService {
    private depositGuideId: number = null;

    constructor(private readonly http: HttpClient) {}

    findAllDepositGuides(filter?: DepositGuideFilter) {
        return this.http.get<any[]>(AppUrls.API_ENDPOINTS.ADMIN.DEPOSIT_GUIDE(filter));
    }

    addClientByDepositGuide(depositGuideId: string) {
        return this.http.post(AppUrls.API_ENDPOINTS.ADMIN.DEPOSIT_GUIDE_ADD_CLIENT(depositGuideId), {});
    }

    exportReport(filter?: DepositGuideFilter) {
        return this.http.post(
            AppUrls.API_ENDPOINTS.ADMIN.EXPORT_REPORT_DEPOSIT_GUIDE(filter),
            {},
            {
                responseType: "blob" as "json",
            }
        );
    }

    public setDepositGuideId(depositGuideId: number): void {
        this.depositGuideId = depositGuideId;
    }

    public getDepositGuideId(): number {
        return this.depositGuideId;
    }
}
