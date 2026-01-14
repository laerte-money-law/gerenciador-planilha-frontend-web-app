import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const requestHeaders = {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
        };
        if (!request.headers.has("Authorization") && AuthService.accessToken) {
            requestHeaders["Authorization"] = `Bearer ${AuthService.accessToken}`;
        }

        const modifiedRequest = request.clone({
            setHeaders: requestHeaders,
        });
        return next.handle(modifiedRequest);
    }
}
