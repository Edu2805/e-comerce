import { Produto } from "src/app/product/models/product";
import { Endereco } from "./address";

export class Fornecedor {
    id: string;
    nome: string;
    documento: string;
    ativo: boolean;
    tipoFornecedor: number;
    endereco: Endereco;
    produtos: Produto[];
}