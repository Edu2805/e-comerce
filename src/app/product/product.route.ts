import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateComponent } from "./create/create.component";
import { DeleteComponent } from "./delete/delete.component";
import { DetailsComponent } from "./details/details.component";
import { ProductAppComponent } from "./product.app.component";
import { ReadComponent } from "./read/read.component";
import { ProductGuard } from "./services/product.guard";
import { ProductResolve } from "./services/product.resolve";
import { UpdateComponent } from "./update/update.component";

const productRouterConfig: Routes = [
    {
        path: '', component: ProductAppComponent,
        children: [
            { path: 'listar-todos', component: ReadComponent },
            {
                path: 'adicionar-novo', component: CreateComponent,
                canDeactivate: [ProductGuard],
                canActivate: [ProductGuard],
                data: [{ claim: { name: 'Produto', value: 'Adicionar' } }],
            },
            {
                path: 'editar/:id', component: UpdateComponent,
                canActivate: [ProductGuard],
                data: [{ claim: { name: 'Produto', value: 'Atualizar' } }],
                resolve: {
                    produto: ProductResolve
                }
            },
            {
                path: 'detalhes/:id', component: DetailsComponent,
                resolve: {
                    produto: ProductResolve
                }
            },
            {
                path: 'excluir/:id', component: DeleteComponent,
                canActivate: [ProductGuard],
                data: [{ claim: { name: 'Produto', value: 'Excluir' } }],
                resolve: {
                    produto: ProductResolve
                }
            },
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