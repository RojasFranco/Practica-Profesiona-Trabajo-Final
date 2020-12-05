import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PedidosService } from '../../services/pedido.service';

@Component({
  selector: 'app-input-switch',
  templateUrl: './input-switch.component.html',
  styleUrls: ['./input-switch.component.scss'],
})
export class InputSwitchComponent implements OnInit {

  estadoActual: string;
  estadoPost: string;

  constructor(
    private pedidosService: PedidosService
  ) {
    this.setearEstadoDetalle();
  }

  ngOnInit() {}

  estadoChange(ev: any) {
    if (ev.detail.value === 'actual') {
      this.pedidosService.pedidoDetalle.estado = this.estadoActual;
    }
    if (ev.detail.value === 'siguiente') {
      this.pedidosService.pedidoDetalle.estado = this.estadoPost;
    }
  }

  setearEstadoDetalle() {
    this.estadoActual = this.pedidosService.pedidoDetalle.estado;
    switch (this.estadoActual) {
      case 'Pendiente':
        this.estadoPost = 'Preparando';
        break;
      case 'Preparando':
        this.estadoPost = 'Listo para servir';
        break;
      case 'Listo para servir':
        this.estadoPost = 'Entregado';
        break;
      default:
        break;
    }
  }

  setearEstadoPedido() {
    this.estadoActual = '';
    this.estadoPost = 'Preparando';
  }

}
