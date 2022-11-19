import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Fornecedor } from '../models/providerEntity';
import { ProviderService } from '../services/provider.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  provider: Fornecedor = new Fornecedor();
  addressMap;

  constructor(private route: ActivatedRoute, 
    private providerService: ProviderService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService) {

    this.spinner.show();
    this.provider = this.route.snapshot.data['provider'];
    this.addressMap = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?q=" + this.fullAddress() + '&key=AIzaSyAP0WKpL7uTRHGKWyakgQXbW6FUhrrA5pE');
    this.spinner.hide();
  }

  public fullAddress(): string {
    return this.provider.endereco.logradouro + ", " + this.provider.endereco.numero + " - " + this.provider.endereco.bairro + ", " + this.provider.endereco.cidade + " - " + this.provider.endereco.estado;
  }

}
