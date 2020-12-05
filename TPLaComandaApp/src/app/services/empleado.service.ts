import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  tipo: string;
  docID: string;

  constructor() { }

}
