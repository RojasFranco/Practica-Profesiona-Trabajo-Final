import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedido-mozo-confirma-pago',
  templateUrl: './pedido-mozo-confirma-pago.page.html',
  styleUrls: ['./pedido-mozo-confirma-pago.page.scss'],
})
export class PedidoMozoConfirmaPagoPage implements OnInit {

  previousurl: string;

  constructor(
    public pedidosService: PedidosService,
    private router: Router
  ) {
    this.previousurl = router['transitions'].value.currentSnapshot.url;
   }

  ngOnInit() {
  }

}
