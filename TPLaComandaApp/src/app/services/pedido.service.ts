import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Pedido } from '../models/pedido-model';
import { PedidoDetalle } from '../models/pedido-detalle-model';
import { ToastService } from './ui-service.service';
import { AngularFireAuth } from 'angularfire2/auth';
//
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  titulo: string;

  pedidos: Pedido[] = [];
  pedido: Pedido;
  PedidosDetalle: PedidoDetalle[] = [];
  pedidoDetalle: PedidoDetalle;
  totalPedido: number;

  pedidosAPagar: Pedido[] = [];

  // crear propiedades para user

  constructor(
    private ngFireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastService: ToastService
    ) { }

  getPedidos() {
    return this.afs.collection('pedidos').snapshotChanges();
  }

  getPedido(id) {
    return this.afs.collection('pedidos').doc(id).snapshotChanges();
  }

  createPedido(pedido) {
    return new Promise( resolve => {
        this.afs.collection('pedidos').add(pedido);
        resolve(true);
    });
  }

  public updatePedido(documentId: string, data: any) {
    return new Promise( resolve => {
      this.afs.collection('pedidos').doc(documentId).set(data);
      resolve(true);
    });
  }

  AddDetallePedido(detalle: PedidoDetalle) {
    if (this.pedido.detallePedido.length > 0  ) {
      for (const item of this.pedido.detallePedido) {
        if (item.conceptoDocID === detalle.conceptoDocID) {
          this.toastService.presentToast( 'El producto ya fue agregado a la orden.' );
          return;
        }
      }
    }
    this.pedido.detallePedido.push(detalle);
    this.sumarPedido();
  }

  sumarPedido() {
    this.totalPedido = 0;
    for (const item of this.pedido.detallePedido) {
      this.totalPedido = this.totalPedido + +item.importeTotal;
    }
  }

  getMesas() {
    return this.afs.collection('mesas').snapshotChanges();
  }

  async getPedidoRealizado(): Promise<boolean>{
    const usuarioDocID = this.ngFireAuth.auth.currentUser.uid;
    let observador: Subscription;
    const terminado = await new Promise<boolean>((resolve, reject) => {
      observador = this.getPedidos().subscribe((snap) => {
        let bandera = true;
        snap.forEach((data) =>{
          let pedido: Pedido = new Pedido();
          pedido = data.payload.doc.data();
          pedido.docID = data.payload.doc.id;
          if(pedido.usuarioDocID === usuarioDocID && pedido.estado == 'Preparando'){
            bandera = false;
            resolve(true);
          }
        });
        if(bandera){
          resolve(false);
        }
      });
    });
    if(terminado == true || terminado == false){
      observador.unsubscribe();
      return terminado;
    }
  }

  public cerrarPedido(pedido: Pedido){
    let hora = new Date();
    let actual = hora.toString();
    let pedidoModificado: Pedido = {
      detallePedido: pedido.detallePedido,
      estado: 'Cerrado',
      usuarioDocID: pedido.usuarioDocID,
      usuarioNombre: pedido.usuarioNombre,
      mesaDocID: pedido.mesaDocID,
      mesaNro: pedido.mesaNro,
      fechaInicio: pedido.fechaInicio,
      fechaFin: actual,
      importeTotal: pedido.importeTotal,
    };
    this.afs.collection('pedidos').doc(pedido.docID).update(pedidoModificado).then((data) =>{
      console.log("cambiado");
    });
  }
}
