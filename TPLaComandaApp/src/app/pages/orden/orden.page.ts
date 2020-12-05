import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedido.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.page.html',
  styleUrls: ['./orden.page.scss'],
})
export class OrdenPage implements OnInit {

  previousurl: string;
  eliminaPedido: boolean;

  constructor(
    public pedidosService: PedidosService,
    private router: Router
  ) {
    this.previousurl = router['transitions'].value.currentSnapshot.url;
   }

  ngOnInit() {
  }

  deleteConcepto(i: number) {
    this.pedidosService.pedido.detallePedido.splice(i, 1);
    this.pedidosService.sumarPedido();
  }

}
