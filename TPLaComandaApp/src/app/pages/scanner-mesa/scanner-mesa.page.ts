import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ScannerService } from '../../services/scanner.service';
import { ConceptosService } from '../../services/concepto.service';
import { PedidosService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido-model';
import { AsignarMesaService } from '../../services/asignar-mesa.service';
import { AuthService } from '../../services/auth.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-scanner-mesa',
  templateUrl: './scanner-mesa.page.html',
  styleUrls: ['./scanner-mesa.page.scss'],
})
export class ScannerMesaPage implements OnInit {

  optionsSlide = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  loading;
  constructor(
    private navCtrl: NavController,
    private scannerMesaService: ScannerService,
    private conceptosService: ConceptosService,
    private pedidosService: PedidosService,
    private asignarMesaService: AsignarMesaService,
    private loadingCtrl: LoadingController,
    private homeService: HomeService,
    private authService: AuthService
    ) { }

  async ngOnInit() {
    // disparar qr
    this.cargarMenu();
    //this.navCtrl.navigateRoot('/pedido');
    await this.scannerMesa();
  }

  async scannerMesa() {
    // llamo al servicio
    const qrMesa: string = await this.scannerMesaService.scanMesa();
    const qrEnLista: boolean = await this.asignarMesaService.buscarMesaQR(qrMesa);
    if(qrEnLista){
      let clienteUID: string = this.authService.getUIDUserLoggeado();
      const clienteEnMesa: boolean = await this.asignarMesaService.buscarClienteEnMesa(clienteUID, qrMesa);
      if(clienteEnMesa){
        this.asignarMesaService.codigoMesaAsignada = qrMesa;
        this.cargarMenu();
        this.homeService.puedeConsultar = true;
        const pedidoConfirmado: boolean = await this.pedidosService.getPedidoRealizado();
        debugger;
        if(pedidoConfirmado){
          console.log('En pedido confirmado');
          this.presentarLoading();
          this.navCtrl.navigateRoot('/home-mesas');
        }
        if(!pedidoConfirmado){
          this.presentarLoading();
          this.navCtrl.navigateRoot('/pedido');
        }
      }
    }
  }

  volver() {
    this.navCtrl.navigateRoot('/home');
  }

  async presentarLoading(){
    this.loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null,
      duration: 3000,
    });

    this.loading.present();
  }

  async cargarMenu() {
    this.pedidosService.pedido = new Pedido();
    this.conceptosService.conceptos = [];
    await this.conceptosService.getConceptos()
    .subscribe((snap) => {
      snap.forEach(async (data: any) => {
        const concepto = data.payload.doc.data();
        concepto.docID = data.payload.doc.id;
        if (concepto.estado === 'habilitado') {
          this.conceptosService.conceptos.push(concepto);
        }
      });
    });
  }


}
