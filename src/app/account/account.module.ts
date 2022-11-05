import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AccountAppComponent } from './account.app.component';
import { AccountRoutingModule } from './account.route';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'


@NgModule({
  declarations: [
    RegistrationComponent,
    LoginComponent,
    AccountAppComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class AccountModule { }
