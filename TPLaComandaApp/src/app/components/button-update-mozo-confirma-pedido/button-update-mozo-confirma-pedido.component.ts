import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { HomeMesasService } from 'src/app/services/home-mesas.service';
import { PedidosService } from 'src/app/services/pedido.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { ToastService } from 'src/app/services/ui-service.service';
import { AsignarMesaService } from '../../services/asignar-mesa.service';
import { IMesa, IMesaID } from '../../clases/mesa';

@Component({
  selector: 'app-button-update-mozo-confirma-pedido',
  templateUrl: './button-update-mozo-confirma-pedido.component.html',
  styleUrls: ['./button-update-mozo-confirma-pedido.component.scss'],
})
export class ButtonUpdateMozoConfirmaPedidoComponent implements OnInit {

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
    private homeMesasService: HomeMesasService,
    private pushNotificationService: PushNotificationService,
    private asignarMesaService: AsignarMesaService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {}

  async btnSi() {
    this.update('Cerrado');
  }

  async btnNo() {
    // Falta funcionalidad
  }

  async update(estado) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null,
      duration: 2000
    });
    loading.present();
    const docID = this.pedidosService.pedido.docID;

    console.log(this.pedidosService.pedido);

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

    const mesa: IMesaID = {codigoqr: this.pedido.mesaNro, id: this.pedido.mesaDocID, cliente: '', estado: ''};
    this.asignarMesaService.liberarMesa(mesa);

    if (modificado) {
      this.toastService.presentToast( 'Cuenta del pedido cerrada.' );

      this.homeMesasService.pedidoConfirmado = true;
      this.homeMesasService.getMenuMesas();
      this.navCtrl.navigateRoot(`/lista-pedidos`);
    } else {
      this.toastService.presentToast( 'Error al actualizar pedido.' );
    }

  }


}
