import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { SystemUser } from '../models/systemuser';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  errors: any[] = [];
  loginForm: FormGroup;
  user: SystemUser;
  validationMessages: ValidationMessages;
  genericValidation: GenericValidator;
  displayMessage: DisplayMessage = {};

  constructor(private fb: FormBuilder, 
    private accountService: AccountService,
    private router: Router,
    private toastrService: ToastrService) { 

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
    this.genericValidation = new GenericValidator(this.validationMessages);

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.rangeLength([6,15])]],
    })
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidation.processarMensagens(this.loginForm);
    })
  }

  login() {
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
        this.router.navigate(['/home']);
      });
    }
  }

  processFailure(fail: any) {
    this.errors = fail.error.errors;
    this.toastrService.error('Ocorreu um erro', 'Erro');
  }

}
