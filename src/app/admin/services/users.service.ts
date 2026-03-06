import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppUrls } from "src/app/app.urls";
import { Observable } from "rxjs";
import { PaginatedResponseDto } from "./spreadsheet.service";
import { UsersRequestParamsDto } from "../models/users-request-params.dto";
import { UserResponseDto } from "../models/user.dto";
import { CreateUserRequestDto } from "../models/create-user-request.dto";

@Injectable({
  providedIn: "root",
})
export class UsersService {

  constructor(private readonly http: HttpClient) {}

  findAllUsers(filter?: UsersRequestParamsDto)
  : Observable<PaginatedResponseDto<UserResponseDto>> {

    return this.http.get<PaginatedResponseDto<UserResponseDto>>(
      AppUrls.API_ENDPOINTS.ADMIN.USERS_LIST(),
      { params: this.toHttpParams(filter) }
    );
  }

  createUser(dto: CreateUserRequestDto): Observable<UserResponseDto> {
    return this.http.post<UserResponseDto>(
      AppUrls.API_ENDPOINTS.ADMIN.CREATE_USER(),
      dto
    );
  }

  deleteUser(userId: number): Observable<void> {

  return this.http.delete<void>(
      AppUrls.API_ENDPOINTS.ADMIN.DELETE_USER(userId)
    )
  }

  private toHttpParams<T extends object>(obj: T): HttpParams {
    return new HttpParams({ fromObject: obj as any });
  }
}