import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AttachmentDto } from "../attachments.dto";
import { AppUrls } from "src/app/app.urls";
import { filter, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AttachmentService {
    constructor(private readonly http: HttpClient) {}
    
    uploadAttachment(formData: FormData):Observable<{ id: string }>  {
        return this.http.post<{ id: string }>(AppUrls.API_ENDPOINTS.ADMIN.ATTACHMENT.UPLOAD(), formData);
    }

    listAttachments(metadataId: string, rowId: number): Observable<AttachmentDto[]> {
        return this.http.get<AttachmentDto[]>(AppUrls.API_ENDPOINTS.ADMIN.ATTACHMENT.LIST(metadataId, rowId))
    }

    deleteAttachment(id: string, spreadsheetMetadataId: string): Observable<AttachmentDto[]> {
        return this.http.delete<AttachmentDto[]>(AppUrls.API_ENDPOINTS.ADMIN.ATTACHMENT.DELETE(id),
         {params: this.toHttpParams({ spreadsheetMetadataId: spreadsheetMetadataId })})
    }

    private toHttpParams<T extends object>(obj: T): HttpParams {
        return new HttpParams({ fromObject: obj as any });
    }

}