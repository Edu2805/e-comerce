import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@narik/custom-validators';
import { fromEvent, merge, Observable } from 'rxjs';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { SystemUser } from '../models/systemuser';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  erros: any[] = [];
  registrationForm: FormGroup;
  user: SystemUser;
  validationMessages: ValidationMessages;
  genericValidation: GenericValidator;
  displayMessage: DisplayMessage = {};

  constructor(private fb: FormBuilder, private accountService: AccountService) { 

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
    this.genericValidation = new GenericValidator(this.validationMessages);

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
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidation.processarMensagens(this.registrationForm);
    })
  }

  addAccount() {
    if (this.registrationForm.dirty && this.registrationForm.valid) {
      this.user = Object.assign({}, this.user, this.registrationForm.value);

      this.accountService.registerUser(this.user)
        .subscribe(
          success => {this.processSuccess(success)},
          failure => {this.processFailure(failure)}
        );
    }
  }

  processSuccess(response: any) {

  }

  processFailure(fail: any) {
    
  }

}
