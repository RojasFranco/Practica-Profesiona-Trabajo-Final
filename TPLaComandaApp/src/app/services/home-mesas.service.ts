import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Pedido } from '../models/pedido-model';
import { PedidosService } from './pedido.service';

@Injectable({
  providedIn: 'root'
})
export class HomeMesasService {

  // propiedades provisoria
  pedidoConfirmado = false;

  // lista de botones del menu
  listaMenu: Menu[];

  private mesasCards: Menu[];

  constructor(
    private ngFireAuth: AngularFireAuth,
    private pedidosService: PedidosService
    ) {
      console.log('Entra al homeMesas');
   }


   async getMenuMesas() {
     // tslint:disable-next-line:no-debugger
     this.listaMenu = [];
     this.estadoPedido();
   }

   private menuMesas() {
    this.mesasCards = [
      {
        route: '/juegos',
        title: 'Juegos', // siempre visible
        icon: 'trophy',
        class: 'icon_5px',
        style: {'background-color': 'rgb(214 130 5)', 'align-text': 'center'},
        visible: true
      },
      {
        route: '/encuesta',
        title: 'Encuesta', // siempre visible
        icon: 'clipboard',
        class: 'icon_5px',
        style: {'background-color': 'rgb(214 130 5)', 'align-text': 'center'},
        visible: true
      },
      {
        route: '/estado-pedido-cliente-confirma',
        title: 'Estado del pedido', // pedido != Confirmar entrega
        icon: 'eye',
        class: 'icon_5px',
        style: {'background-color': 'rgb(214 130 5)', 'align-text': 'center'},
        visible: this.pedidoConfirmado
      },
      {
        route: '/detalle-cuenta',
        title: 'Pedir cuenta', // pedido == Confirmar entrega
        icon: 'card',
        class: 'icon_5px',
        style: {'background-color': 'rgb(214 130 5)', 'align-text': 'center'},
        visible: !this.pedidoConfirmado
      }
    ];
   }

   private async estadoPedido() {

    return new Promise ( resolve =>
      {
        const docID = this.ngFireAuth.auth.currentUser.uid;

        this.pedidosService.getPedidos()
            .subscribe((snap) => {
              let cuenta = 0;
              snap.forEach(async (data: any) => {
                cuenta++;
                let pedido: Pedido = new Pedido();
                pedido = data.payload.doc.data();
                if (pedido.usuarioDocID === docID && pedido.estado === 'Preparando') {
                  this.pedidoConfirmado = true;
                  this.menuMesas();
                  this.listaMenu = this.mesasCards;
                  resolve(true);
                } else if (pedido.usuarioDocID === docID && pedido.estado === 'Recibió el pedido'){
                  this.pedidoConfirmado = false;
                  this.menuMesas();
                  this.listaMenu = this.mesasCards;
                  resolve(true);
                }
              });
            });
    });
  }

}

export interface Menu {
  route: string;
  title: string;
  icon: string;
  class: string;
  style: object;
  visible: boolean;
}
