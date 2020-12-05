import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-estado-pedido-cliente',
  templateUrl: './estado-pedido-cliente.page.html',
  styleUrls: ['./estado-pedido-cliente.page.scss'],
})
export class EstadoPedidoClientePage implements OnInit {

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
