import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { CpfCnpjValidators } from 'src/app/utils/document-validators-form';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { StringUtils } from 'src/app/utils/string-utils';
import { QueryCep } from '../models/address';
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
  vaidateDocument: any;
  documentText: string = 'CPF (requerido)';

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
        cpfInvalido: 'CPF inválido',
        cnpjInvalido: 'CNPJ inválido'
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
      documento: ['', Validators.compose([Validators.required, CpfCnpjValidators.cpf])],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],

      endereco: this.fb.group({
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]]
      })
    });
    this.providerForm.patchValue({tipoFornecedor: '1', ativo: true});
  }

  ngAfterViewInit(): void {
    this.providerFormType().valueChanges
      .subscribe(() => {
        this.changeValidateDocumentType();
        this.validateElementsConfig();
        this.formValidate();
      })

    this.validateElementsConfig();
  }

  validateElementsConfig() {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.formValidate();
    })
  }

  formValidate() {
    this.displayMessage = this.genericValidation.processarMensagens(this.providerForm);
    this.unsavedChanges = true;
  }

  changeValidateDocumentType() {
    if (this.providerFormType().value === '1') {
      this.document().clearValidators();
      this.document().setValidators([Validators.required, CpfCnpjValidators.cpf]);
      this.documentText = "CPF (requerido)";
    } else {
      this.document().clearValidators();
      this.document().setValidators([Validators.required, CpfCnpjValidators.cnpj]);
      this.documentText = "CNPJ (requerido)";
    }
  }

  providerFormType(): AbstractControl {
    return this.providerForm.get('tipoFornecedor');
  }

  document():AbstractControl {
    return this.providerForm.get('documento');
  }

  findCep(event: Event) {
    let cep = (event.target as HTMLInputElement).value;
    cep = StringUtils.onlyNumber(cep);
    if (cep.length < 8) return;

    this.providerService.queryCep(cep)
      .subscribe(
        cepRetorno => this.fillAddressQuery(cepRetorno),
        erro => this.errors.push(erro));
  }

  fillAddressQuery(queryCep: QueryCep) {
    this.providerForm.patchValue({
      endereco: {
        logradouro: queryCep.logradouro,
        bairro: queryCep.bairro,
        cep: queryCep.cep,
        cidade: queryCep.localidade,
        estado: queryCep.uf
      }
    });
  }

  addProvider() {
    if (this.providerForm.dirty && this.providerForm.valid) {
      this.provider = Object.assign({}, this.provider, this.providerForm.value);
      this.formResult = JSON.stringify(this.provider);

      this.provider.endereco.cep = StringUtils.onlyNumber(this.provider.endereco.cep);
      this.provider.documento = StringUtils.onlyNumber(this.provider.documento);

      this.provider.tipoFornecedor = this.provider.tipoFornecedor == 1 ? +'1' : +'2';
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

  documentMask(): string {
    if (this.providerForm.get('tipoFornecedor').value == "1") {
      return "000.000.000-00";
    } else if (this.providerForm.get('tipoFornecedor').value == "2") {
      return "00.000.000/0000-00";
    }
    return "";
  }

  get documento() {
    return this.providerForm.get('documento');
  }

  get tipoFornecedor() {
    return this.providerForm.get('tipoFornecedor');
  }
}
