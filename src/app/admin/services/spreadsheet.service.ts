import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppUrls } from "src/app/app.urls";
import { SpreadsheetContext, SpreadSheetDetailsDto, SpreadSheetDto, SpreadSheetRequestParamsDto } from "../models/spreadsheet.dto";
import { Observable } from "rxjs";

export class PaginatedResponseDto<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
@Injectable({
    providedIn: "root",
})
export class SpreadSheetService {
    private id: string;

    constructor(private readonly http: HttpClient) {}

    findAllSpreadSheetsPaged(filter?: SpreadSheetRequestParamsDto): Observable<PaginatedResponseDto<SpreadSheetDto>>{
        return this.http.get<PaginatedResponseDto<SpreadSheetDto>>(AppUrls.API_ENDPOINTS.ADMIN.SPREADSHEET_LIST(),
            {params: this.toHttpParams(filter)}
        );
    }

    getSpreadSheetPaged(id: string, filter?: SpreadSheetRequestParamsDto): Observable<SpreadSheetDetailsDto>{
        return this.http.get<SpreadSheetDetailsDto>(AppUrls.API_ENDPOINTS.ADMIN.SPREADSHEET_LIST_DETAIL(id),
            {params: this.toHttpParams(filter)},
        );
    }

    importSpreadsheet(formData: FormData): Observable<any> {
        return this.http.post(AppUrls.API_ENDPOINTS.ADMIN.IMPORT(), formData);
    }

    addColumn(spreadsheetId: string, data: { columnName: string }): Observable<any> {
        return this.http.post(
            AppUrls.API_ENDPOINTS.ADMIN.SPREADSHEET_ADD_COLUMN(spreadsheetId),
            data
        );
    }

    deleteColumn(spreadsheetId: string, data: { columnName: string }): Observable<any> {
        return this.http.delete(
            AppUrls.API_ENDPOINTS.ADMIN.SPREADSHEET_DELETE_COLUMN(spreadsheetId),
            { body: data }
        );
    }

    updateRow(spreadsheetId: string, rowId: number, body: Record<string, any>): Observable<any> {
        return this.http.post(
            AppUrls.API_ENDPOINTS.ADMIN.SPREADSHEET_UPDATE_ROW(spreadsheetId, rowId),
            body
        );
    }

    getQuotationContext(): SpreadsheetContext {
        return{ id: this.id}

    }

    private toHttpParams<T extends object>(obj: T): HttpParams {
        return new HttpParams({ fromObject: obj as any });
    }


}
