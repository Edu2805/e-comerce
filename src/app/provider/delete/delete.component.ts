import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Fornecedor } from '../models/providerEntity';
import { ProviderService } from '../services/provider.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent {

  provider: Fornecedor = new Fornecedor();
  addressMap;

  constructor(
    private providerService: ProviderService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
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

  deleteEvent() {
    this.spinner.show();
    this.providerService.deleteProvider(this.provider.id)
      .subscribe(
        event => { this.successExclusion(event)},
        error => { this.fail() }
      );
  }

  successExclusion(event: any) {
    const toast = this.toastr.success('Fornecedor excluido com Sucesso!', 'Good bye :D');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.spinner.hide()
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  fail() {
    this.toastr.error('Houve um erro no processamento!', 'Ops! :(');
    this.spinner.hide();
  }

}
