import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(array: any[], texto: string): any[] {
    if (texto === '' || texto === undefined) {
      return array;
    }
    texto = texto.toLowerCase();

    return array.filter( item => {
      return item.name.toLowerCase().includes( texto );
    });
  }

}
