import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateComponent } from "./create/create.component";
import { ProductAppComponent } from "./product.app.component";
import { ReadComponent } from "./read/read.component";

const productRouterConfig: Routes = [
    {
        path: '', component: ProductAppComponent,
        children: [
            { path: 'listar-todos', component: ReadComponent },
            {
                path: 'adicionar-novo', component: CreateComponent
            }
        ]
    },
]

@NgModule({
    imports: [
        RouterModule.forChild(productRouterConfig)
    ],
    exports: [RouterModule]
})
export class ProductRoutingModule {}