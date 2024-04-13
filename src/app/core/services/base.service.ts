import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '@environment';
import { SERVER_ERROR, SESSION_EXPIRED, SOMETHING_BAD_HAPPENED } from '@app/shared/constants';

type ContentType = 'json' | 'formData' | 'binaryArray';
type Headers = {
    'Content-Type': string,
    'Accept'?: string
}

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    public apiURL = environment.apiUrl;

    constructor(
        private _httpClient: HttpClient) {
    }

    get options(): {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } {
        return {
            headers: this._headers(),
            withCredentials: true
        }
    }

    private _headers(contentType?: ContentType): HttpHeaders {
        const headers: Headers = {
            'Content-Type': 'application/json'
        };

        if (contentType) {
            switch (contentType) {
                case 'json':
                    headers['Content-Type'] = 'application/json';
                    break;
                case 'binaryArray':
                    headers['Content-Type'] = 'application/octet-stream';
                    break;
                case 'formData':
                    headers['Accept'] = 'application/json';
                    break;
                default:
                    headers['Content-Type'] = 'application/json';
                    break;
            }
        }

        return new HttpHeaders(headers);
    }

    //#region Base HTTP
    get<T>(url: string): Observable<T> {
        return this._httpClient
            .get<T>(`${this.apiURL}/${url}`, this.options)
            .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
    }

    post<T>(
        url: string,
        data: any
    ): Observable<T> {
        return this._httpClient
            .post<T>(`${this.apiURL}/${url}`, data, this.options)
            .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
    }

    put<T>(
        url: string,
        data: any
    ): Observable<T> {
        return this._httpClient
            .put<T>(`${this.apiURL}/${url}`, data, this.options)
            .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
    }

    delete<T>(url: string): Observable<T> {
        return this._httpClient
            .delete<T>(`${this.apiURL}/${url}`, this.options)
            .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
    }
    //#endregion

    //#region Error Handler
    private handleError(error: HttpErrorResponse) {
        let errorMessage = '';

        switch (error.status) {
            case 401:
                errorMessage = SESSION_EXPIRED
                break;
            case 403:
                errorMessage = SOMETHING_BAD_HAPPENED
                break;
            default:
                errorMessage = error.error?.message ?? SERVER_ERROR;
                console.error(error);
        }

        return throwError(errorMessage);
    }
    //#endregion
}
