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
import { ProviderAppComponent } from "./provider.app.component";
import { ProviderRoutingModule } from "./provider.route";
import { ReadComponent } from "./read/read.component";
import { ProviderGuardService } from "./services/provider.guard";
import { ProviderResolve } from "./services/provider.resolve";
import { ProviderService } from "./services/provider.service";
import { UpdateComponent } from "./update/update.component";

@NgModule({
    declarations: [
      ProviderAppComponent,
      CreateComponent,
      ReadComponent,
      UpdateComponent,
      DeleteComponent,
      DetailsComponent,
      CepPipe,
      CpfPipe,
      CnpjPipe
    ],
    imports: [
      CommonModule,
      ProviderRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule.forRoot(),
      NgxSpinnerModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      ProviderService,
      ProviderResolve,
      ProviderGuardService
    ]
  })
  export class ProviderModule { }