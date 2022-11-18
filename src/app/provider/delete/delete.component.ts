import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private providerService: ProviderService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {

      this.provider = this.route.snapshot.data['provider'];
  }

  deleteEvent() {
    this.providerService.deleteProvider(this.provider.id)
      .subscribe(
        event => { this.successExclusion(event) },
        error => { this.fail() }
      );
  }

  successExclusion(event: any) {

    const toast = this.toastr.success('Fornecedor excluido com Sucesso!', 'Good bye :D');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  fail() {
    this.toastr.error('Houve um erro no processamento!', 'Ops! :(');
  }

}
