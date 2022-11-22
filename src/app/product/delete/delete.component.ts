import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent {

  product: Produto;
  images: string = environment.imagesUrl;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {

      spinner.show();
      this.product = this.route.snapshot.data['produto'];
      spinner.hide();
  }

  public deleteProduct() {
    this.spinner.show();
    this.productService.deleteProduct(this.product.id)
      .subscribe(
      evento => { this.deleteSuccess(evento) },
      ()     => { this.failProcess() }
      );
  }

  public deleteSuccess(evento: any) {
    const toast = this.toastr.success('Produto excluido com Sucesso!', 'Good bye :D');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/produtos/listar-todos']);
        this.spinner.hide()
      });
    }
  }

  public failProcess() {
    this.toastr.error('Houve um erro no processamento!', 'Ops! :(');
    this.spinner.hide()
  }

}
