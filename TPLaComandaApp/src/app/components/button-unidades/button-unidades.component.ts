import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-unidades',
  templateUrl: './button-unidades.component.html',
  styleUrls: ['./button-unidades.component.scss'],
})
export class ButtonUnidadesComponent implements OnInit {

  @Input() label: string;
  @Output() cantidad: EventEmitter<number>;

  importeTotal: number;

  unidad = 1;

  constructor() {
    this.cantidad = new EventEmitter();
  }

  ngOnInit() {}

  addUnidad() {
    this.unidad++;
    this.cantidad.emit(this.unidad);
  }
  removeUnidad() {
    if (this.unidad > 0) {
      this.unidad--;
      this.cantidad.emit(this.unidad);
    }
  }

}
