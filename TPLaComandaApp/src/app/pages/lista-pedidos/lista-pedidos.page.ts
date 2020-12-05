import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Pedido } from 'src/app/models/pedido-model';
import { PedidosService } from '../../services/pedido.service';
import { EmpleadoService } from '../../services/empleado.service';
import { PedidoDetalle } from '../../models/pedido-detalle-model';
import { ConceptosService } from 'src/app/services/concepto.service';
import { AsignarMesaService } from '../../services/asignar-mesa.service';
import { IMesaID } from '../../clases/mesa';
import { Observable, Subscription} from 'rxjs';
@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.page.html',
  styleUrls: ['./lista-pedidos.page.scss'],
})
export class ListaPedidosPage implements OnInit {

  cantPedidos: number;
  listaPedido: number;
  listaMesas: Observable <IMesaID[]>;

  constructor(
    private navCtrl: NavController,
    public pedidosService: PedidosService,
    public empleadoService: EmpleadoService,
    private conceptosService: ConceptosService,
    private asignarMesaService: AsignarMesaService
  ) {
    this.listaPedido = 0;
    this.listaMesas = this.asignarMesaService.listaMesas;
    console.log(this.listaPedido);
  }

  ngOnInit() {
    this.cargarListaDetallePedidos();
  }

  showListaPedido(ev: any) {
    if (ev.detail.value === 'confirma') {
      this.listaPedido = 0;
    } else if (ev.detail.value === 'servir') {
      this.listaPedido = 1;
    } else if (ev.detail.value === 'pago') {
      this.listaPedido = 2;
    }
  }

  mostrarDetalle(detalle: PedidoDetalle) {
    this.pedidosService.pedidoDetalle = detalle;
    this.conceptosService.getConcepto(detalle.conceptoDocID)
    .subscribe((data) => {
      this.conceptosService.concepto = data.payload.data();
    });
    this.pedidosService.getPedido(detalle.pedidoDocID)
    .subscribe((data: any) => {
      this.pedidosService.pedido = data.payload.data();
      this.pedidosService.pedido.docID = detalle.pedidoDocID;
    });
    setTimeout(() => {
      this.navCtrl.navigateRoot(`/estado-pedido`);
    }, 700);
  }

  mostrarPedido(pedido) {
    this.pedidosService.pedido = pedido;
    setTimeout(() => {
      this.navCtrl.navigateRoot(`/estado-pedido-cliente`);
    }, 700);
  }

  confirmarPago(pedido) {
    this.pedidosService.pedido = pedido;
    setTimeout(() => {
      this.navCtrl.navigateRoot(`/cuenta-pedido-cliente`);
    }, 700);
  }

  cargarListaDetallePedidos() {
    this.pedidosService.getPedidos()
    .subscribe((snap) => {
      this.pedidosService.pedidos = [];
      this.pedidosService.pedidosAPagar = [];
      this.pedidosService.PedidosDetalle = [];
      snap.forEach(async (data: any) => {
        let pedido: Pedido = new Pedido();
        pedido = data.payload.doc.data();
        pedido.docID = data.payload.doc.id;
        this.ingresarPedido(pedido);
      });
      console.log(this.pedidosService.pedidos);
      console.log(this.pedidosService.PedidosDetalle);
    });
  }

  ingresarPedido(pedido: Pedido) {
    if (this.empleadoService.tipo === 'cocinero' && pedido.estado !== 'Confirmar') {
      pedido.detallePedido.forEach((detalle: PedidoDetalle) => {
        if ((detalle.conceptoCategoria === 'plato' ||
        detalle.conceptoCategoria === 'postre') &&
        (detalle.estado === 'Pendiente' || detalle.estado === 'Preparando')){
          detalle.pedidoDocID = pedido.docID;
          this.pedidosService.PedidosDetalle.push(detalle);
        }
      });
    }
    if (this.empleadoService.tipo === 'bar tender' && pedido.estado !== 'Confirmar') {
      pedido.detallePedido.forEach((detalle: PedidoDetalle) => {
        if (detalle.conceptoCategoria === 'bebidas' &&
        (detalle.estado === 'Pendiente' || detalle.estado === 'Preparando')){
          detalle.pedidoDocID = pedido.docID;
          this.pedidosService.PedidosDetalle.push(detalle);
        }
      });
    }

    if (this.empleadoService.tipo === 'mozo') {
      pedido.detallePedido.forEach((detalle: PedidoDetalle) => {
        if (detalle.estado === 'Listo para servir'){
          detalle.pedidoDocID = pedido.docID;
          this.pedidosService.PedidosDetalle.push(detalle);
        }
      });
    }
    if (this.empleadoService.tipo === 'mozo' && pedido.estado === 'Confirmar') {
      this.pedidosService.pedidos.push(pedido);
    }
    if (this.empleadoService.tipo === 'mozo' && pedido.estado === 'Solicita cuenta') {
      this.pedidosService.pedidosAPagar.push(pedido);
    }
  }

  public async liberarMesa(mesa: IMesaID){
    console.log("En liberar mesa");
    let observador: Subscription;
    let pedidoEncontrado: Pedido;
    const terminado = await new Promise<boolean>((resolve, reject) => {
      observador = this.pedidosService.getPedidos().subscribe((snap) => {
        let bandera = true;
        let cuenta = 0;
        snap.forEach((data) =>{
          cuenta++;
          let pedido = new Pedido();
          pedido = data.payload.doc.data();
          pedido.docID = data.payload.doc.id;
          if(pedido.mesaDocID == mesa.id && pedido.estado == 'Recibió el pedido'){
            bandera = false;
            pedidoEncontrado = pedido;
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
      if(terminado){
        this.pedidosService.cerrarPedido(pedidoEncontrado);
        this.asignarMesaService.liberarMesa(mesa);
      } 
    }
  }
}
