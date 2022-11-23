import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CurrencyUtils } from 'src/app/utils/currency-utils';
import { ProductBaseComponent } from '../product-form.base.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends ProductBaseComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  imageURL: string;
  imageName: string;

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { super(); }

  ngOnInit(): void {

    this.productService.getAllProviders()
      .subscribe(
        fornecedores => this.fornecedores = fornecedores);

    this.productForm = this.fb.group({
      fornecedorId: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      imagem: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      ativo: [true]
    });
  }

  ngAfterViewInit(): void {
    super.validatorsConfigForm(this.formInputElements);
  }

  addProduct() {
    this.spinner.show();
    if (this.productForm.dirty && this.productForm.valid) {
      this.product = Object.assign({}, this.product, this.productForm.value);

      this.product.imagemUpload = this.croppedImage.split(',')[1];
      this.product.imagem = this.imageName;

      //Específico para o ASP.net
      this.product.valor = CurrencyUtils.StringToDecimal(this.product.valor);

      this.productService.newProduct(this.product)
        .subscribe(
          sucesso => { this.processSuccess(sucesso) },
          falha => { this.processFail(falha) }
        );

      this.unsaveChanges = false;
    }
  }

  processSuccess(response: any) {
    this.productForm.reset();
    this.errors = [];

    let toast = this.toastr.success('Produto cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/produtos/listar-todos']);
        this.spinner.hide();
      });
    }
  }

  processFail(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
    this.spinner.hide();
  }

  documentMask(): string {
    return "R$ 000.000.000,00";
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageName = event.currentTarget.files[0].name;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    this.errors.push('O formato do arquivo ' + this.imageName + ' não é aceito');
  }

}
