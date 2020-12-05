import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedido.service';
import { ToastService } from '../../services/ui-service.service';
import { NavController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { PushNotificationService } from '../../services/push-notification.service';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-button-create-pedido',
  templateUrl: './button-create-pedido.component.html',
  styleUrls: ['./button-create-pedido.component.scss'],
})
export class ButtonCreatePedidoComponent implements OnInit {

  pedido = {
    usuarioDocID: '',
    usuarioNombre: '',
    mesaDocID: '',
    mesaNro: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Confirmar',
    importeTotal: '',
    detallePedido: []
  };

  usuarioDocID: string;
  mesaDocID: string;
  mesaNro: string;

  usuarioNombre: string;

  constructor(
    private ngFireAuth: AngularFireAuth,
    private toastService: ToastService,
    public pedidosService: PedidosService,
    private navCtrl: NavController,
    private pushNotificationService: PushNotificationService,
    private homeService: HomeService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.usuarioDocID = this.ngFireAuth.auth.currentUser.uid;
    this.pedidosService.getMesas().subscribe(snap => {
      snap.forEach(async (data: any) => {
        const mesa = data.payload.doc.data();
        if (mesa.cliente === this.usuarioDocID) {
          const m = data.payload.doc.data();
          this.mesaDocID = data.payload.doc.id;
          this.mesaNro = m.codigoqr;
        }
      });
    });
  }

  async enviarPedido() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null,
      duration: 2000
    });
    loading.present();
    this.pedido.usuarioDocID = this.ngFireAuth.auth.currentUser.uid;
    this.pedido.usuarioNombre = this.homeService.nombre;
    this.pedido.mesaDocID = this.mesaDocID;
    this.pedido.mesaNro = this.mesaNro;
    this.pedido.fechaInicio = new Date().toTimeString();
    this.pedido.fechaFin = '';
    this.pedido.estado = 'Confirmar';
    this.pedido.importeTotal = this.pedidosService.totalPedido.toString();

    this.pedido.detallePedido = this.pedidosService.pedido.detallePedido.map((obj) =>
                    {
                      return Object.assign({}, obj);
                    });



    const creado = await this.pedidosService.createPedido(this.pedido);

    if (creado) {
      this.toastService.presentToast( 'Orden enviada.' );
      // se envia a todos los mozos
      this.pushNotificationService.sendUserIDs('Hay un nuevo pedido a confirmar', 'mozo');

      this.navCtrl.navigateRoot(`/home`);
    } else {
      this.toastService.presentToast( 'Error al enviar la orden.' );
    }
  }

}
