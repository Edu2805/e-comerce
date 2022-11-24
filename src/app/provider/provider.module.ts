import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMaskModule } from "ngx-mask";
import { NgxSpinnerModule } from "ngx-spinner";
import { CepPipe } from "../utils/pipes/cep.pipe";
import { CnpjPipe, CpfPipe } from "../utils/pipes/documents.pipe";
import { CreateComponent } from "./create/create.component";
import { DeleteComponent } from "./delete/delete.component";
import { DetailsComponent } from "./details/details.component";
import { ProductListComponent } from "./products/product-list.component";
import { ProviderAppComponent } from "./provider.app.component";
import { ProviderRoutingModule } from "./provider.route";
import { ReadComponent } from "./read/read.component";
import { ProviderGuardService } from "./services/provider.guard";
import { ProviderResolve } from "./services/provider.resolve";
import { ProviderService } from "./services/provider.service";
import { UpdateComponent } from "./update/update.component";
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(ptBr);

@NgModule({
    declarations: [
      ProviderAppComponent,
      CreateComponent,
      ReadComponent,
      UpdateComponent,
      DeleteComponent,
      DetailsComponent,
      ProductListComponent,
      CepPipe,
      CpfPipe,
      CnpjPipe
    ],
    imports: [
      CommonModule,
      ProviderRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule.forRoot({
        dropSpecialCharacters: false
      }),
      NgxSpinnerModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      ProviderService,
      ProviderResolve,
      ProviderGuardService,
      {
        provide: LOCALE_ID, useValue: 'pt' 
    },
    {
        provide:  DEFAULT_CURRENCY_CODE,
        useValue: 'BRL'
    }
    ]
  })
  export class ProviderModule { }