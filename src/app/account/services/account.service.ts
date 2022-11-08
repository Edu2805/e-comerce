import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, map } from "rxjs";
import { BaseService } from "src/app/services/base.service";
import { SystemUser } from "../models/systemuser";

@Injectable()
export class AccountService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    registerUser(user: SystemUser): Observable<SystemUser> {
        let response = this.http
            .post(this.UrlServiceV1 + 'nova-conta', user, this.GetHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));
        return response;
    }

    login(user: SystemUser) {
        
    }
}