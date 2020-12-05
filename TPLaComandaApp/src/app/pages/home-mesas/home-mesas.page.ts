import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HomeMesasService } from '../../services/home-mesas.service';
import { PedidosService } from '../../services/pedido.service';
import { ConceptosService } from '../../services/concepto.service';
import { Pedido } from 'src/app/models/pedido-model';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-home-mesas',
  templateUrl: './home-mesas.page.html',
  styleUrls: ['./home-mesas.page.scss'],
})
export class HomeMesasPage implements OnInit {

  previousurl: string;
  usuarioDocID: string;

  constructor(
    private navCtrl: NavController,
    public homeMesasService: HomeMesasService,
    private router: Router,
    public pedidosService: PedidosService,
    public conceptosService: ConceptosService,
    private ngFireAuth: AngularFireAuth
  ) {
    console.log('Home-mesas');
    this.previousurl = router['transitions'].value.currentSnapshot.url;
    this.usuarioDocID = this.ngFireAuth.auth.currentUser.uid;
  }

  ngOnInit() {
    this.homeMesasService.getMenuMesas();
  }

  showPage(url: string) {
    this.cargarPedido();
    setTimeout(() => {
      this.navCtrl.navigateRoot(url);
    }, 700);
  }

  cargarPedido() {
    this.pedidosService.getPedidos()
    .subscribe((snap: any) => {
      this.pedidosService.pedidos = [];
      this.pedidosService.PedidosDetalle = [];
      snap.forEach(async (data: any) => {
        let pedido: Pedido = new Pedido();
        pedido = data.payload.doc.data();
        if (pedido.usuarioDocID === this.usuarioDocID) {
          this.pedidosService.PedidosDetalle = pedido.detallePedido;
        }
      });
    });
  }


}
