import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CreateComponent } from './create/create.component';
import { DeleteComponent } from "./delete/delete.component";
import { DetailsComponent } from "./details/details.component";
import { ProductAppComponent } from "./product.app.component";
import { ProductRoutingModule } from "./product.route";
import { ReadComponent } from "./read/read.component";
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
        ProductRoutingModule

    ],
    providers: [

    ]
})
export class ProductModule {}