import { ElementRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormBaseComponent } from "../base-components/form-base.components";
import { Produto, Fornecedor } from "./models/product";

export abstract class ProductBaseComponent extends FormBaseComponent{

    product: Produto;
    fornecedores: Fornecedor[];
    errors: any[] = [];
    productForm: FormGroup;

    constructor(){

        super();
        this.validationMessages = {
            fornecedorId: {
              required: 'Escolha um fornecedor',
            },
            nome: {
              required: 'Informe o Nome',
              minlength: 'Mínimo de 2 caracteres',
              maxlength: 'Máximo de 200 caracteres'
            },
            descricao: {
              required: 'Informe a Descrição',
              minlength: 'Mínimo de 2 caracteres',
              maxlength: 'Máximo de 1000 caracteres'
            },
            imagem: {
              required: 'Informe a Imagem',
            },
            valor: {
              required: 'Informe o Valor',
            }
          };
          super.messageConfigValidatorBase(this.validationMessages);
    }

    protected validatorsConfigForm(formInputElements: ElementRef[]) {
        super.formConfigValidatorsBase(formInputElements, this.productForm);
    }
    
}