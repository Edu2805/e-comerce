import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/product';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  product: Produto;
  images: string = environment.imagesUrl;

  constructor(private route: ActivatedRoute) {

    this.product = this.route.snapshot.data['produto'];
  }

}
