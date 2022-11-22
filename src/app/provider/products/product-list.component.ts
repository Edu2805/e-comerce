import { Component, Input } from "@angular/core";
import { Produto } from "src/app/product/models/product";
import { environment } from "src/environments/environment";

@Component({
    selector: 'product-list',
    templateUrl: './product-list.component.html'
})
export class ProductListComponent {
    images: string = environment.imagesUrl;

    @Input()
    products: Produto[];
}