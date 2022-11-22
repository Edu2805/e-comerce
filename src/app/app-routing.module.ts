import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDaniedComponent } from './navegation/access-denied/access-denied.component';
import { HomeComponent } from './navegation/home/home.component';
import { NotFoundComponent } from './navegation/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'conta',
    loadChildren: () => import('./account/account.module')
      .then(m => m.AccountModule)
  },
  {
    path: 'fornecedores',
    loadChildren: () => import('./provider/provider.module')
      .then(m => m.ProviderModule)
  },
  {
    path: 'produtos',
    loadChildren: () => import('./product/product.module')
      .then(m => m.ProductModule)
  },
  
  { path: 'acesso-negado', component: AccessDaniedComponent },
  { path: 'nao-encontrado', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
