import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImageCropperModule } from "ngx-image-cropper";
import { NgxMaskModule } from "ngx-mask";
import { NgxSpinnerModule } from "ngx-spinner";
import { CreateComponent } from './create/create.component';
import { DeleteComponent } from "./delete/delete.component";
import { DetailsComponent } from "./details/details.component";
import { ProductAppComponent } from "./product.app.component";
import { ProductRoutingModule } from "./product.route";
import { ReadComponent } from "./read/read.component";
import { ProductGuard } from "./services/product.guard";
import { ProductResolve } from "./services/product.resolve";
import { ProductService } from "./services/product.service";
import { UpdateComponent } from "./update/update.component";

@NgModule({
    declarations: [
        ProductAppComponent,
        CreateComponent,
        UpdateComponent,
        DeleteComponent,
        ReadComponent,
        DetailsComponent
  ],
    imports: [
        CommonModule,
        ProductRoutingModule,
        NgxSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        NgxSpinnerModule,
        ImageCropperModule

    ],
    providers: [
        ProductService,
        ProductResolve,
        ProductGuard
    ]
})
export class ProductModule {}