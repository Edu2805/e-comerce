import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseService } from "src/app/services/base.service";
import { Endereco, QueryCep } from "../models/address";
import { Fornecedor } from "../models/providerEntity";

@Injectable()
export class ProviderService extends BaseService{

  provider: Fornecedor = new Fornecedor();

  constructor(private http: HttpClient ) { 
    super();
  }

  newProvider(provider: Fornecedor): Observable<Fornecedor> {
    return this.http
      .post(this.UrlServiceV1 + 'fornecedores', provider, this.GetAuthHeaderJson())
      .pipe(
        map(super.extractData),
        catchError(super.serviceError));
  }

  getAllProviders(): Observable<Fornecedor[]> {
    return this.http
      .get<Fornecedor[]>(this.UrlServiceV1 + 'fornecedores')
      .pipe(catchError(super.serviceError));
  }

  findProviderById(id: string): Observable<Fornecedor> {
    return this.http
      .get<Fornecedor>(this.UrlServiceV1 + 'fornecedores/' + id, super.GetAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  updateProvider(provider: Fornecedor): Observable<Fornecedor> {
    return this.http
      .put(this.UrlServiceV1 + "fornecedores/" + provider.id, provider, super.GetAuthHeaderJson())
      .pipe(
        map(super.extractData),
        catchError(super.serviceError));
  }

  deleteProvider(id: string): Observable<Fornecedor> {
    return new Observable<Fornecedor>;
  }

  queryCep(cep: string): Observable<QueryCep> {
    return this.http
      .get<QueryCep>(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(catchError(super.serviceError));
  }

  updateAddress(endereco: Endereco): Observable<Endereco> {
    return this.http
        .put(this.UrlServiceV1 + "fornecedores/endereco/" + endereco.id, endereco, super.GetAuthHeaderJson())
        .pipe(
            map(super.extractData),
            catchError(super.serviceError));
}
}
