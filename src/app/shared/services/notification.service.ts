import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    constructor(public toastr: ToastrService) {}

    showSuccess(message: string, title?: string, timeout?: number): void {
        this.toastr.success(message, title || "Pronto!", {
            progressBar: true,
            positionClass: "toast-bottom-center",
            timeOut: timeout || 5000,
        });
    }

    showError(message: string, title?: string, timeout?: number): void {
        this.toastr.error(message, title || "Oops!", {
            progressBar: true,
            timeOut: timeout || 5000,
            positionClass: "toast-bottom-center",
        });
    }
}
