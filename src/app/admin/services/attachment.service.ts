import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AttachmentDto } from "../attachments.dto";
import { AppUrls } from "src/app/app.urls";
import { Observable } from "rxjs";

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

}