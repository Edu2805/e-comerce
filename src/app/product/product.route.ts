import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductAppComponent } from "./product.app.component";

const productRouterConfig: Routes = [
    {
        path: '', component: ProductAppComponent,
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(productRouterConfig)
    ],
    exports: [RouterModule]
})
export class ProductRoutingModule {}