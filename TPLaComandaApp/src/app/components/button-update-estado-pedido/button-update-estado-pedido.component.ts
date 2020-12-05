import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { ToastService } from 'src/app/services/ui-service.service';
import { PedidosService } from '../../services/pedido.service';

@Component({
  selector: 'app-button-update-estado-pedido',
  templateUrl: './button-update-estado-pedido.component.html',
  styleUrls: ['./button-update-estado-pedido.component.scss'],
})
export class ButtonUpdateEstadoPedidoComponent implements OnInit {

  pedido = {
    usuarioDocID: '',
    usuarioNombre: '',
    mesaDocID: '',
    mesaNro: '',
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    importeTotal: '',
    detallePedido: []
  };

  constructor(
    private pedidosService: PedidosService,
    private toastService: ToastService,
    private navCtrl: NavController,
    private pushNotificationService: PushNotificationService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {}

  async update() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null,
      duration: 2000
    });
    loading.present();
    const docID = this.pedidosService.pedido.docID;

    for (const iterator of this.pedidosService.pedido.detallePedido) {
      if (this.pedidosService.pedidoDetalle.conceptoDocID === iterator.conceptoDocID){
        this.pedido.detallePedido.push(this.pedidosService.pedidoDetalle);
        if (this.pedidosService.pedidoDetalle.estado === 'Listo para servir') {
          this.pushNotificationService
          .sendUserIDsEmpleado(`Nuevo pedido a entregar (${this.pedidosService.pedidoDetalle.conceptoNombre})`, 'mozo');
        }
      } else {
        this.pedido.detallePedido.push(iterator);
      }
    }

    this.pedido.usuarioDocID = this.pedidosService.pedido.usuarioDocID;
    this.pedido.usuarioNombre = this.pedidosService.pedido.usuarioNombre;
    this.pedido.mesaDocID = this.pedidosService.pedido.mesaDocID;
    this.pedido.mesaNro = this.pedidosService.pedido.mesaNro;
    this.pedido.fechaInicio = this.pedidosService.pedido.fechaInicio;
    this.pedido.fechaFin = '';
    this.pedido.estado = this.pedidoEntregado() ? 'Confirmar entrega' : this.pedidosService.pedido.estado;
    this.pedido.importeTotal = this.pedidosService.pedido.importeTotal;


    const modificado = await this.pedidosService.updatePedido(docID, this.pedido);

    if (modificado) {
      this.toastService.presentToast( 'Pedido actualizado.' );
      this.navCtrl.navigateRoot(`/lista-pedidos`);
    } else {
      this.toastService.presentToast( 'Error al actualizar pedido.' );
    }

  }

  pedidoEntregado() {
    for (const iterator of this.pedido.detallePedido) {
      if (iterator.estado !== 'Entregado'){
        return false;
      }
    }
    return true;
  }

}
