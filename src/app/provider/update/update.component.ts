import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { ValidationMessages, GenericValidator, DisplayMessage } from 'src/app/utils/generic-form-validation';
import { Endereco } from '../models/address';
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
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};
  documentText: string = '';

  providerType: number;
  formResult: string = '';

  unsaveChanges: boolean;

  constructor(private fb: FormBuilder,
    private providerService: ProviderService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute) {

    this.validationMessages = {
      name: {
        required: 'Informe o Nome',
      },
      document: {
        required: 'Informe o Documento'
      },
      street: {
        required: 'Informe o Logradouro',
      },
      number: {
        required: 'Informe o Número',
      },
      district: {
        required: 'Informe o Bairro',
      },
      cep: {
        required: 'Informe o CEP'
      },
      city: {
        required: 'Informe a Cidade',
      },
      state: {
        required: 'Informe o Estado',
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

    this.providerService.findProviderById(route.params['id'])
      .subscribe(provider => this.provider = provider);
  }

  ngOnInit() {

    this.providerForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]]
    });

    this.addressForm = this.fb.group({
      iid: '',
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: ''
    });
  }

  ngAfterViewInit() {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.providerForm);
      this.unsaveChanges = true;
    });
  }

  editProvider() {
    if (this.providerForm.dirty && this.providerForm.valid) {

      this.provider = Object.assign({}, this.provider, this.providerForm.value);

      this.providerService.updateProvider(this.provider)
        .subscribe(
          success => { this.processSuccess(success) },
          fail => { this.processFail(fail) }
        );

      this.unsaveChanges = false;
    }
  }

  processSuccess(response: any) {
    this.errors = [];

    let toast = this.toastr.success('Fornecedor atualizado com sucesso!', 'Sucesso!');
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
