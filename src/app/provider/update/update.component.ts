import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { CpfCnpjValidators } from 'src/app/utils/document-validators-form';
import { ValidationMessages, GenericValidator, DisplayMessage } from 'src/app/utils/generic-form-validation';
import { StringUtils } from 'src/app/utils/string-utils';
import { Endereco, QueryCep } from '../models/address';
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
  errorsAddress: any[] = [];
  providerForm: FormGroup;
  addressForm: FormGroup;
  provider: Fornecedor = new Fornecedor();
  address: Endereco = new Endereco();

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
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) {

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
    this.spinner.show();

    this.providerForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],
    });

    this.addressForm = this.fb.group({
      id: '',
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: ''
    });
    this.fillForm();

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
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

    this.addressForm.patchValue({
      id: this.provider.endereco.id,
      logradouro: this.provider.endereco.logradouro,
      numero: this.provider.endereco.numero,
      complemento: this.provider.endereco.complemento,
      bairro: this.provider.endereco.bairro,
      cep: this.provider.endereco.cep,
      cidade: this.provider.endereco.cidade,
      estado: this.provider.endereco.estado
    });
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
    this.addressForm.patchValue({
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
      this.provider.documento = StringUtils.onlyNumber(this.provider.documento);

      this.provider.tipoFornecedor = this.provider.tipoFornecedor == 1 ? +'1' : +'2';
      this.providerService.updateProvider(this.provider)
        .subscribe(
          success => { this.processSuccess(success) },
          fail => { this.processFail(fail) }
        );
    }
  }

  editAddress() {
    if (this.addressForm.dirty && this.addressForm.valid) {
      this.address = Object.assign({}, this.address, this.addressForm.value);
      this.address.cep = StringUtils.onlyNumber(this.address.cep);
      this.address.fornecedorId = this.provider.id;

      this.providerService.updateAddress(this.address)
        .subscribe(
          () => this.processSuccessAddress(this.address),
          falha => { this.processFailAddress(falha) }
        );
    }
  }

  processSuccessAddress(address: Endereco) {
    this.errors = [];

    this.toastr.success('Endereço atualizado com sucesso!', 'Sucesso!');
    this.provider.endereco = address
    this.modalService.dismissAll();
  }

  processFailAddress(fail: any) {
    this.errorsAddress = fail.error.errors;
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

  showModal(content) {
    this.modalService.open(content);
  }
}
