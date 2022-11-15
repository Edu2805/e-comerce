import { Endereco } from "./address";

export class Fornecedor {
    id: string;
    nome: string;
    documento: string;
    ativo: boolean;
    tipoFornecedor: number;
    endereco: Endereco;
}