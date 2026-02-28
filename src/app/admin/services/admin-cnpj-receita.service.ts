import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CnpjResponse } from '../models/cnpj-response.dto';

@Injectable({providedIn: 'root'})
export class ReceitaService {
    private readonly apiUrl = `${environment.apiUrl}/api/cnpj`;
    constructor(private readonly http: HttpClient) {}

    getDataByCNPJ(cnpj: string): Observable<CnpjResponse> {
        return this.http.get<CnpjResponse>(`${this.apiUrl}/${cnpj}`);
    }
}
