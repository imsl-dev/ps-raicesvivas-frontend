import { Pipe, PipeTransform } from '@angular/core';
import { TipoEvento } from '../models/enums/Enums';

@Pipe({
  name: 'tipoEvento',
  standalone: true
})
export class TipoEventoPipe implements PipeTransform {
  transform(value: TipoEvento): string {
    const nombres: { [key in TipoEvento]: string } = {
      [TipoEvento.REFORESTACION]: 'Reforestación',
      [TipoEvento.RECOLECCION_BASURA]: 'Recolección de Basura',
      [TipoEvento.JUNTA_ALIMENTOS]: 'Junta de Alimentos',
      [TipoEvento.DONACIONES]: 'Donaciones'
    };
    return nombres[value] || value;
  }
}