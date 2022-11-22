import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  public products: Produto[];
  errorMessage: string;
  images: string = environment.imagesUrl;
  errors: any[] = [];

  constructor(private productService: ProductService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

    ngOnInit(): void {
      this.spinner.show();
      this.productService.getAllProducts()
      .subscribe(
        products => {
          this.products = products,
          this.spinner.hide();
        },
        fail => { 
          this.spinner.hide();
          this.processFail(fail) 
        }
      );
    }

  processFail(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

}
