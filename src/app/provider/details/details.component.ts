import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Fornecedor } from '../models/providerEntity';
import { ProviderService } from '../services/provider.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  provider: Fornecedor = new Fornecedor();

  constructor(private route: ActivatedRoute, private providerService: ProviderService) {

    this.provider = this.route.snapshot.data['provider'];
  }

}
