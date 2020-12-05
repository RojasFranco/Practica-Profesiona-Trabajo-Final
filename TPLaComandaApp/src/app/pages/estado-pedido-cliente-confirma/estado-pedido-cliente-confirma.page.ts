import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido } from 'src/app/models/pedido-model';
import { ConceptosService } from 'src/app/services/concepto.service';
import { PedidosService } from 'src/app/services/pedido.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-estado-pedido-cliente-confirma',
  templateUrl: './estado-pedido-cliente-confirma.page.html',
  styleUrls: ['./estado-pedido-cliente-confirma.page.scss'],
})
export class EstadoPedidoClienteConfirmaPage implements OnInit {

  previousurl: string;
  pedido = new Pedido();

  constructor(
    public conceptosService: ConceptosService,
    public pedidosService: PedidosService,
    private ngFireAuth: AngularFireAuth,
    private router: Router
  ) {
    this.previousurl = router['transitions'].value.currentSnapshot.url;
  }

  ngOnInit() {
    const usuarioDocID = this.ngFireAuth.auth.currentUser.uid;
    this.pedidosService.getPedidos()
    .subscribe((snap) => {
      snap.forEach(async (data: any) => {
        let pedido: Pedido = new Pedido();
        pedido = data.payload.doc.data();
        pedido.docID = data.payload.doc.id;
        if (pedido.usuarioDocID === usuarioDocID &&
          (pedido.estado === 'Preparando' || pedido.estado === 'Confirmar entrega')) {
            this.pedidosService.pedido = pedido;
            this.pedido = pedido;
            this.pedidosService.sumarPedido();
            return;
        }
      });
    });
  }

}
