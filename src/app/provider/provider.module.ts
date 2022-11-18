import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMaskModule } from "ngx-mask";
import { CreateComponent } from "./create/create.component";
import { DeleteComponent } from "./delete/delete.component";
import { DetailsComponent } from "./details/details.component";
import { ProviderAppComponent } from "./provider.app.component";
import { ProviderRoutingModule } from "./provider.route";
import { ReadComponent } from "./read/read.component";
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
      DetailsComponent
    ],
    imports: [
      CommonModule,
      ProviderRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      NgxMaskModule.forRoot(),
    ],
    providers: [
      ProviderService,
      ProviderResolve
    ]
  })
  export class ProviderModule { }