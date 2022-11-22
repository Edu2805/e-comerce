import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Fornecedor } from "src/app/provider/models/providerEntity";
import { BaseService } from "src/app/services/base.service";
import { catchError, map } from "rxjs/operators";
import { Produto } from "../models/product";

@Injectable()
export class ProductService extends BaseService {

    constructor(private http: HttpClient) { super() }

    getAllProviders(): Observable<Fornecedor[]> {
        return this.http
            .get<Fornecedor[]>(this.UrlServiceV1 + "fornecedores")
            .pipe(catchError(super.serviceError));
    }

    newProduct(produto: Produto): Observable<Produto> {
        return this.http
            .post(this.UrlServiceV1 + "produtos", produto, super.GetAuthHeaderJson())
            .pipe(
                map(super.extractData),
                catchError(super.serviceError));
    }

    getAllProducts(): Observable<Produto[]> {
        return this.http
            .get<Produto[]>(this.UrlServiceV1 + "produtos", super.GetAuthHeaderJson())
            .pipe(catchError(super.serviceError));
    }
}