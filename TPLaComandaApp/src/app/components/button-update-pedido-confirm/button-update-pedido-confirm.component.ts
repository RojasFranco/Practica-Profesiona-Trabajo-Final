import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { PedidosService } from 'src/app/services/pedido.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { ToastService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-button-update-pedido-confirm',
  templateUrl: './button-update-pedido-confirm.component.html',
  styleUrls: ['./button-update-pedido-confirm.component.scss'],
})
export class ButtonUpdatePedidoConfirmComponent implements OnInit {

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

  async aceptar() {
    this.update('Preparando');
  }

  async rechazar() {
    this.update('Rechazado');
  }

  async update(estado) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null,
      duration: 2000
    });
    loading.present();
    const docID = this.pedidosService.pedido.docID;

    this.pedido.usuarioDocID = this.pedidosService.pedido.usuarioDocID;
    this.pedido.usuarioNombre = this.pedidosService.pedido.usuarioNombre;
    this.pedido.mesaDocID = this.pedidosService.pedido.mesaDocID;
    this.pedido.mesaNro = this.pedidosService.pedido.mesaNro;
    this.pedido.fechaInicio = this.pedidosService.pedido.fechaInicio;
    this.pedido.fechaFin = '';
    this.pedido.estado = estado;
    this.pedido.importeTotal = this.pedidosService.pedido.importeTotal;

    this.pedido.detallePedido = this.pedidosService.pedido.detallePedido.map((obj) =>
    {
      return Object.assign({}, obj);
    });

    const modificado = await this.pedidosService.updatePedido(docID, this.pedido);

    if (modificado) {
      estado === 'Rechazado' ? this.toastService.presentToast( 'Pedido rechazado.' ) :
      this.toastService.presentToast( 'Pedido aceptado.' );

      // se envia a todos los cocinero y bartender
      for (const iterator of this.pedido.detallePedido) {
        let tipo = '';
        if (iterator.conceptoCategoria === 'plato' || iterator.conceptoCategoria === 'postre') {
          tipo = 'cocinero';
        } else {
          tipo = 'bar tender';
        }
        this.pushNotificationService.sendUserIDsEmpleado(`Nuevo pedido a realizar (${iterator.conceptoNombre})`, tipo);
      }

      this.navCtrl.navigateRoot(`/lista-pedidos`);
    } else {
      this.toastService.presentToast( 'Error al actualizar pedido.' );
    }

  }

}
