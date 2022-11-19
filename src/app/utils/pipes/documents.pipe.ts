import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'cpf' })
export class CpfPipe implements PipeTransform {
    transform(value: string|number): string {
        let formatValue = value + '';

        formatValue = formatValue
            .padStart(11, '0')
            .substr(0, 11)
            .replace(/[^0-9]/, '')
            .replace(
                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                '$1.$2.$3-$4'
            );

        return formatValue;
    }
}

@Pipe({ name: 'cnpj' })
export class CnpjPipe implements PipeTransform {
    transform(value: string|number): string {
        let formatValue = value + '';

        formatValue = formatValue
            .padStart(14, '0')
            .substr(0, 14)
            .replace(/[^0-9]/, '')
            .replace(
                /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                '$1.$2.$3/$4-$5'
            );

        return formatValue;
    }
}