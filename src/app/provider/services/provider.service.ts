import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseService } from "src/app/services/base.service";
import { Fornecedor } from "../models/providerEntity";

@Injectable()
export class ProviderService extends BaseService{

  provider: Fornecedor = new Fornecedor();

  constructor(private http: HttpClient ) { 
    super();
  }

  newProvider(provider: Fornecedor): Observable<Fornecedor> {
    return new Observable<Fornecedor>;
  }

  // getAllProviders(): Observable<ProviderEntity[]> {
  //   return this.http
  //     .get<ProviderEntity[]>(this.UrlServiceV1 + "fornecedores")
  //     .pipe(catchError(super.serviceError));
  // }

  getAllProviders(): Observable<Fornecedor[]> {
    return this.http
      .get<Fornecedor[]>(this.UrlServiceV1 + "fornecedores").pipe(
      map((obj) => obj),
      catchError((e) => this.serviceError(e))
    );
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
}
