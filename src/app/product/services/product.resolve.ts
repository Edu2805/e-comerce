import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Produto } from "../models/product";
import { ProductService } from "./product.service";

@Injectable()
export class ProductResolve implements Resolve<Produto> {

    constructor(private productService: ProductService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.productService.findById(route.params['id']);
    }
}