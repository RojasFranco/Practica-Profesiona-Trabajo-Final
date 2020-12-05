import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ConceptosService } from 'src/app/services/concepto.service';
import { PedidosService } from 'src/app/services/pedido.service';
import { PedidoDetalle } from '../../models/pedido-detalle-model';

@Component({
  selector: 'app-concepto',
  templateUrl: './concepto.page.html',
  styleUrls: ['./concepto.page.scss'],
})
export class ConceptoPage implements OnInit {

  docID: string;
  importeTotal: number;
  unidad = 1;
  previousurl: string;
  pedidoDetalle: PedidoDetalle = new PedidoDetalle();

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    public conceptosService: ConceptosService,
    private pedidoService: PedidosService,
    public authService: AuthService,
    private router: Router
  ) {
                this.docID = this.activatedRoute.snapshot.paramMap.get('id');
                this.previousurl = router['transitions'].value.currentSnapshot.url;
  }

  ngOnInit() {
    this.importeTotal = +this.conceptosService.concepto.precio * this.unidad;
  }

  RecalculoTotal(cantidad: number) {
    this.unidad = cantidad;
    this.importeTotal = +this.conceptosService.concepto.precio * cantidad;
  }

  agregarAlPedido() {
    this.pedidoDetalle.cantidad = this.unidad.toString();
    this.pedidoDetalle.conceptoDocID = this.docID.toString();
    this.pedidoDetalle.conceptoNombre = this.conceptosService.concepto.nombre;
    this.pedidoDetalle.conceptoCategoria = this.conceptosService.concepto.categoria;
    this.pedidoDetalle.importeUnitario = this.conceptosService.concepto.precio;
    this.pedidoDetalle.importeTotal = this.importeTotal.toString();
    this.pedidoDetalle.tiempo = this.conceptosService.concepto.tiempo;
    this.pedidoDetalle.estado = 'Pendiente';
    this.pedidoService.AddDetallePedido(this.pedidoDetalle);
    this.navCtrl.navigateRoot(this.previousurl);
  }

}
