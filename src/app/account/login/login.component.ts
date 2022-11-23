import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBaseComponent } from 'src/app/base-components/form-base.components';
import { SystemUser } from '../models/systemuser';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends FormBaseComponent implements OnInit {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  errors: any[] = [];
  loginForm: FormGroup;
  user: SystemUser;
  returnUrl: string;

  constructor(private fb: FormBuilder, 
    private accountService: AccountService,
    private router: Router,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute) { 

      super();
    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      }
    };
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    super.messageConfigValidatorBase(this.validationMessages);

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.rangeLength([6,15])]],
    })
  }

  ngAfterViewInit(): void {
    super.formConfigValidatorsBase(this.formInputElements, this.loginForm);
  }

  login() {
    this.spinner.show();
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.user = Object.assign({}, this.user, this.loginForm.value);

      this.accountService.login(this.user)
        .subscribe(
          success => {this.processSuccess(success)},
          failure => {this.processFailure(failure)}
        );
    }
  }

  processSuccess(response: any) {
    this.loginForm.reset();
    this.errors = [];

    this.accountService.LocalStorage.salvarDadosLocaisUsuario(response);
    let toast = this.toastrService.success('Login realizado com sucesso', 'Bem vindo (a)!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.returnUrl 
        ? this.router.navigate([this.returnUrl])
        : this.router.navigate(['/home']);
        this.spinner.hide();
      });
    }
  }

  processFailure(fail: any) {
    this.errors = fail.error.errors;
    this.toastrService.error('Ocorreu um erro', 'Erro');
    this.spinner.hide();
  }

}
