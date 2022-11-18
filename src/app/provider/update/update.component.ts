import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { CpfCnpjValidators } from 'src/app/utils/document-validators-form';
import { ValidationMessages, GenericValidator, DisplayMessage } from 'src/app/utils/generic-form-validation';
import { StringUtils } from 'src/app/utils/string-utils';
import { QueryCep } from '../models/address';
import { Fornecedor } from '../models/providerEntity';
import { ProviderService } from '../services/provider.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errors: any[] = [];
  providerForm: FormGroup;
  provider: Fornecedor = new Fornecedor();

  validationMessages: ValidationMessages;
  genericValidation: GenericValidator;
  displayMessage: DisplayMessage = {};
  vaidateDocument: any;
  documentText: string = '';

  formResult: string= '';
  unsavedChanges: boolean;
  providerType: number;
  
  constructor(private fb: FormBuilder,
    private providerService: ProviderService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute) {

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

    this.provider = this.route.snapshot.data['provider'];
      
    this.providerType = this.provider.tipoFornecedor;
  }

  ngOnInit() {
    this.providerForm = this.fb.group({
      if: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],
    });
    this.fillForm();
  }

  fillForm() {
    this.providerForm.patchValue({
      id: this.provider.id,
      nome: this.provider.nome,
      ativo: this.provider.ativo,
      tipoFornecedor: this.provider.tipoFornecedor.toString(),
      documento: this.provider.documento
    });

    if (this.providerFormType().value === '1') {
      this.document().setValidators([Validators.required, CpfCnpjValidators.cpf]);
    } else {
      this.document().setValidators([Validators.required, CpfCnpjValidators.cnpj]);
    }
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
        logradouro: queryCep.logradouro,
        bairro: queryCep.bairro,
        cep: queryCep.cep,
        cidade: queryCep.localidade,
        estado: queryCep.uf
    });
  }

  editProvider() {
    if (this.providerForm.dirty && this.providerForm.valid) {
      this.provider = Object.assign({}, this.provider, this.providerForm.value);
      this.formResult = JSON.stringify(this.provider);

      this.provider.endereco.cep = StringUtils.onlyNumber(this.provider.endereco.cep);
      this.provider.documento = StringUtils.onlyNumber(this.provider.documento);

      this.provider.tipoFornecedor = this.provider.tipoFornecedor == 1 ? +'1' : +'2';
      this.providerService.updateProvider(this.provider)
        .subscribe(
          success => { this.processSuccess(success) },
          fail => { this.processFail(fail) }
        );
    }
  }

  documentMask(): string {
    if (this.providerForm.get('tipoFornecedor').value == "1") {
      return "000.000.000-00";
    } else if (this.providerForm.get('tipoFornecedor').value == "2") {
      return "00.000.000/0000-00";
    }
    return "";
  }

  processSuccess(response: any) {
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
