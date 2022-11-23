import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '@narik/custom-validators';
import { SystemUser } from '../models/systemuser';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBaseComponent } from 'src/app/base-components/form-base.components';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent extends FormBaseComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  errors: any[] = [];
  registrationForm: FormGroup;
  user: SystemUser;
  unsavedChanges: boolean;

  constructor(private fb: FormBuilder, 
    private accountService: AccountService,
    private router: Router,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService) { 

    super();
    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      },
      confirmPassword: {
        required: 'Informe a senha novamente',
        rangeLength: 'A senha deve possuir entre 6 a 15 caracteres',
        equalTo: 'As senhas não conferem'
      }
    };
    super.messageConfigValidatorBase(this.validationMessages);

  }

  ngOnInit(): void {
    let passwordToVerify = new FormControl('', [Validators.required, CustomValidators.rangeLength([6,15])]);
    let passwordConfirm = new FormControl('', [Validators.required, CustomValidators.rangeLength([6,15]), 
        CustomValidators.equalTo(passwordToVerify)]);
    
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: passwordToVerify,
      confirmPassword: passwordConfirm
    })
  }

  ngAfterViewInit(): void {
    super.formConfigValidatorsBase(this.formInputElements, this.registrationForm);
  }

  addAccount() {
    this.spinner.show();
    if (this.registrationForm.dirty && this.registrationForm.valid) {
      this.user = Object.assign({}, this.user, this.registrationForm.value);

      this.accountService.registerUser(this.user)
        .subscribe(
          success => {this.processSuccess(success)},
          failure => {this.processFailure(failure)}
        );
        this.unsavedChanges = false;
    }
  }

  processSuccess(response: any) {
    this.registrationForm.reset();
    this.errors = [];

    this.accountService.LocalStorage.salvarDadosLocaisUsuario(response);
    let toast = this.toastrService.success('Registro realizado com sucesso', 'Bem vindo (a)!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/home']);
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
