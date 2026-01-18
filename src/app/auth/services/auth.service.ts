import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppUrls } from "../../app.urls";
import { Observable, of, tap } from "rxjs";
import { LogInFormDto } from "../models/form/log-in.form.dto";
import { jwtDecode } from "jwt-decode";
import { NgxSpinnerService } from "ngx-spinner";
import { UserRoleEnum } from "../models/enum/user-role.enum";
import { Router } from "@angular/router";
import { UserInfoDto } from "../../shared/models/user-info.dto";
import { UserClientInfoDto } from "../../client/models/dto/user-client-info.dto";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private static readonly ACCESS_TOKEN = "ACCESS_TOKEN";
    private static readonly REFRESH_TOKEN = "REFRESH_TOKEN";
    private _userInfo: UserInfoDto;
    private _userClientInfo: UserClientInfoDto;

    public static get accessToken(): string {
        return localStorage.getItem(AuthService.ACCESS_TOKEN);
    }
    public static get refreshToken(): string {
        return localStorage.getItem(AuthService.REFRESH_TOKEN);
    }

    public get userInfo(): UserInfoDto {
        return this._userInfo;
    }
    public get userClientInfo(): UserClientInfoDto {
        return this._userClientInfo;
    }

    constructor(
        private readonly http: HttpClient,
        private readonly spinner: NgxSpinnerService,
        private readonly router: Router
    ) { }

    logIn(loginInputDTO: LogInFormDto): Observable<any> {
        return this.http.post<any>(AppUrls.API_ENDPOINTS.AUTH.LOG_IN(), loginInputDTO);
    }

    getDashboardSummary(): Observable<any> {
        return this.http.get<any>(AppUrls.API_ENDPOINTS.ADMIN.DASHBOARD_SUMMARY());
    }

    logout(): void {
        localStorage.removeItem(AuthService.ACCESS_TOKEN);
        localStorage.removeItem(AuthService.REFRESH_TOKEN);
        this._userInfo = null;
        this._userClientInfo = null;
        this.router.navigate([AppUrls.PATHS.AUTH.ROOT()]);
    }

    isLoggedIn(): boolean {
        const isLoggedIn = AuthService.accessToken && !this.isTokenExpired(AuthService.accessToken);
        if (isLoggedIn) {
            this.setUserInfoFromToken();
        }
        return isLoggedIn;
    }

    isAdmin(): boolean {
        return this.isLoggedIn() && this.userInfo.role === UserRoleEnum.ADMIN;
    }

    storeTokenInSession(accessToken: string, refreshToken: string): void {
        localStorage.setItem(AuthService.ACCESS_TOKEN, accessToken);
        localStorage.setItem(AuthService.REFRESH_TOKEN, refreshToken);
    }

    refreshTokenIfAvailable(): Observable<any> {
        this.spinner.show();
        if (AuthService.accessToken && this.isTokenExpired(AuthService.accessToken)) {
            return this.http.post<any>(AppUrls.API_ENDPOINTS.AUTH.REFRESH_TOKEN(), { refreshToken: AuthService.refreshToken }).pipe(
                tap((data) => {
                    this.storeTokenInSession(data.accessToken, data.refreshToken);
                    this.spinner.hide();
                })
            );
        } else {
            this.spinner.hide();
            return of(null);
        }
    }

    redirectToApp(): void {
        const jwtTokenDecoded = jwtDecode(AuthService.accessToken);

        switch (jwtTokenDecoded["role"]) {
            case UserRoleEnum.ADMIN:
                this.spinner.hide();
                this.router.navigate([AppUrls.PATHS.ADMIN.ROOT()]);
                break;

            case UserRoleEnum.CLIENT:
                this.spinner.hide();
                this.router.navigate([AppUrls.PATHS.CLIENT.ROOT()]);
                break;

            default:
                break;
        }
    }

    private isTokenExpired(token: string): boolean {
        if (!token) return true;

        const tokenDecoded = jwtDecode(token);
        const exp = tokenDecoded["exp"];
        const now = new Date().getTime() / 1000;
        return exp < now;
    }

    private setUserInfoFromToken(): void {
        const tokenJwt = AuthService.accessToken;
        if (tokenJwt) {
            const tokenDecoded: any = jwtDecode(tokenJwt);
            this._userInfo = new UserInfoDto(tokenDecoded);
            if (tokenDecoded["role"] === UserRoleEnum.CLIENT) {
                this._userClientInfo = new UserClientInfoDto(tokenDecoded);
            }
        }
    }
}
