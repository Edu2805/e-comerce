import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AccountAppComponent } from './account.app.component';
import { AccountRoutingModule } from './account.route';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { AccountService } from './services/account.service';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';


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
    HttpClientModule,
    NarikCustomValidatorsModule
  ],
  providers: [
    AccountService
  ]
})
export class AccountModule { }
