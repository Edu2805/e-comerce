import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateComponent } from "./create/create.component";
import { DeleteComponent } from "./delete/delete.component";
import { DetailsComponent } from "./details/details.component";
import { ProviderAppComponent } from "./provider.app.component";
import { ReadComponent } from "./read/read.component";
import { ProviderGuardService } from "./services/provider.guard";
import { ProviderResolve } from "./services/provider.resolve";
import { UpdateComponent } from "./update/update.component";

const providerRouterConfig: Routes = [
    {
        path: '', component: ProviderAppComponent,
        children: [
            { path: 'listar-todos', component: ReadComponent },
            { 
                path: 'adicionar-novo', component: CreateComponent,
                canDeactivate: [ProviderGuardService],
                canActivate: [ProviderGuardService],
                data: [{ claim: {name: 'Fornecedor', value: 'Adicionar'}}]
            },
            { 
                path: 'editar/:id', component: UpdateComponent,
                canActivate: [ProviderGuardService],
                data: [{ claim: {name: 'Fornecedor', value: 'Atualizar'}}],
                resolve: {
                    provider: ProviderResolve
                }
            },
            { 
                path: 'detalhes/:id', component: DetailsComponent,
                resolve: {
                    provider: ProviderResolve
                }
            },
            { 
                path: 'excluir/:id', component: DeleteComponent,
                canActivate: [ProviderGuardService],
                data: [{ claim: {name: 'Fornecedor', value: 'Excluir'}}],
                resolve: {
                    provider: ProviderResolve
                }
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(providerRouterConfig)
    ],
    exports: [RouterModule]
})
export class ProviderRoutingModule { }