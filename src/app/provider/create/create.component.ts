import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { Fornecedor } from '../models/providerEntity';
import { ProviderService } from '../services/provider.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errors: any[] = [];
  providerForm: FormGroup;
  provider: Fornecedor = new Fornecedor();

  validationMessages: ValidationMessages;
  genericValidation: GenericValidator;
  displayMessage: DisplayMessage = {};

  formResult: string= '';
  unsavedChanges: boolean;
  
  constructor(private fb: FormBuilder,
    private providerService: ProviderService,
    private router: Router,
    private toastr: ToastrService) {

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      documento: {
        required: 'Informe o Documento',
      },
      logradouro: {
        required: 'Informe o Logradouro',
      },
      numero: {
        required: 'Informe o Número',
      },
      bairro: {
        required: 'Informe o Bairro',
      },
      cep: {
        required: 'Informe o CEP'
      },
      cidade: {
        required: 'Informe a Cidade',
      },
      estado: {
        required: 'Informe o Estado',
      }
    };
    this.genericValidation = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    this.providerForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidation.processarMensagens(this.providerForm);
      this.unsavedChanges = true;
    })
  }

  addProvider() {
    if (this.providerForm.dirty && this.providerForm.valid) {

      this.provider = Object.assign({}, this.provider, this.providerForm.value);
      this.formResult = JSON.stringify(this.provider);

      this.providerService.newProvider(this.provider)
        .subscribe(
          success => { this.processSuccess(success) },
          fail => { this.processFail(fail) }
        );
        this.unsavedChanges = false;
    }
  }

  processSuccess(response: any) {
    this.providerForm.reset();
    this.errors = [];

    let toast = this.toastr.success('Fornecedor cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processFail(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }
}
