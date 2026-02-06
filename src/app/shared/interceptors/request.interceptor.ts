import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        const headers: Record<string, string> = {};



        if (!request.headers.has('Authorization') && AuthService.accessToken) {
            headers['Authorization'] = `Bearer ${AuthService.accessToken}`;
        }

        const modifiedRequest = request.clone({
            setHeaders: headers,
        });

        return next.handle(modifiedRequest);
    }
}
