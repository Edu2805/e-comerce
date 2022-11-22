import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { CurrencyUtils } from 'src/app/utils/currency-utils';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { environment } from 'src/environments/environment';
import { Fornecedor, Produto } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  imageBase64: any;
  imagePreview: any;
  imageName: string;
  product: Produto;
  providers: Fornecedor[];
  errors: any[] = [];
  productForm: FormGroup;
  images: string = environment.imagesUrl;
  originalImageSrc: string;

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};
  
  formResult: string = '';

  unsaveChanges: boolean;

  constructor(private fb: FormBuilder,
    private produtoService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {

    this.validationMessages = {
      fornecedorId: {
        required: 'Escolha um fornecedor',
      },
      nome: {
        required: 'Informe o Nome',
        minlength: 'Mínimo de 2 caracteres',
        maxlength: 'Máximo de 200 caracteres'
      },
      descricao: {
        required: 'Informe a Descrição',
        minlength: 'Mínimo de 2 caracteres',
        maxlength: 'Máximo de 1000 caracteres'
      },
      imagem: {
        required: 'Informe a Imagem',
      },
      valor: {
        required: 'Informe o Valor',
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.product = this.route.snapshot.data['produto'];
  }

  ngOnInit(): void {

    this.produtoService.getAllProviders()
      .subscribe(
        fornecedores => this.providers = fornecedores);

    this.productForm = this.fb.group({
      fornecedorId: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      imagem: [''],
      valor: ['', [Validators.required]],
      ativo: [0]
    });

    this.productForm.patchValue({
      fornecedorId: this.product.fornecedorId,
      id: this.product.id,
      nome: this.product.nome,
      descricao: this.product.descricao,
      ativo: this.product.ativo,
      valor: CurrencyUtils.DecimalToParse(this.product.valor)
    });
    this.originalImageSrc = this.images + this.product.imagem;
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.productForm);
      this.unsaveChanges = true;
    });
  }

  updateProduct() {
    if (this.productForm.dirty && this.productForm.valid) {
      this.product = Object.assign({}, this.product, this.productForm.value);

     if (this.imageBase64) {
        this.product.imagemUpload = this.imageBase64;
        this.product.imagem = this.imageName;
     }
     
     this.product.valor = CurrencyUtils.StringToDecimal(this.product.valor);
     this.produtoService.updateProduct(this.product)
        .subscribe(
          sucesso => { this.processSuccess(sucesso) },
          falha => { this.proccessFail(falha) }
        );

      this.unsaveChanges = false;
    }
  }

  processSuccess(response: any) {
    this.productForm.reset();
    this.errors = [];

    let toast = this.toastr.success('Produto editado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/produtos/listar-todos']);
      });
    }
  }

  proccessFail(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  } 

  upload(file: any) {
    this.imageName = file[0].name;

    var reader = new FileReader();
    reader.onload = this.manipulateReader.bind(this);
    reader.readAsBinaryString(file[0]);
  }

  manipulateReader(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.imageBase64 = btoa(binaryString);
    this.imagePreview = 'data:image/jpeg;base64,' + this.imageBase64;
  }

}
