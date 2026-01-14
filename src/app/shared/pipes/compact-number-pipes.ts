import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compactNumber'
})
export class CompactNumberPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '-';

    if (value < 1_000_000) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
      }).format(value);
    }

    const formatted = new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(value);

    return formatted.replace(/\s?mi/, 'M').replace(/\s?milhões?/, 'M');
  }
}
