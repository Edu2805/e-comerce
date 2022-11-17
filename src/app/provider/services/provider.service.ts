import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseService } from "src/app/services/base.service";
import { QueryCep } from "../models/address";
import { Fornecedor } from "../models/providerEntity";

@Injectable()
export class ProviderService extends BaseService{

  provider: Fornecedor = new Fornecedor();

  constructor(private http: HttpClient ) { 
    super();
  }

  newProvider(provider: Fornecedor): Observable<Fornecedor> {
    return this.http
      .post(this.UrlServiceV1 + "fornecedores", provider, this.GetAuthHeaderJson())
      .pipe(
        map(super.extractData),
        catchError(super.serviceError));
  }

  getAllProviders(): Observable<Fornecedor[]> {
    return this.http
      .get<Fornecedor[]>(this.UrlServiceV1 + "fornecedores")
      .pipe(catchError(super.serviceError));
  }

  findProviderById(id: string): Observable<Fornecedor> {
    return new Observable<Fornecedor>;
  }

  updateProvider(fornecedor: Fornecedor): Observable<Fornecedor> {
    return new Observable<Fornecedor>;
  }

  deleteProvider(id: string): Observable<Fornecedor> {
    return new Observable<Fornecedor>;
  }

  queryCep(cep: string): Observable<QueryCep> {
    return this.http
      .get<QueryCep>(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(catchError(super.serviceError));
  }
}
