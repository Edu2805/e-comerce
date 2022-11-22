import { Component, OnInit } from '@angular/core';
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

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getAllProducts()
      .subscribe(
        products => this.products = products,
        error => this.errorMessage);
  }

}
