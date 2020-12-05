import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConceptosService } from 'src/app/services/concepto.service';
import { PedidosService } from '../../services/pedido.service';

@Component({
  selector: 'app-estado-pedido',
  templateUrl: './estado-pedido.page.html',
  styleUrls: ['./estado-pedido.page.scss'],
})
export class EstadoPedidoPage implements OnInit {

  previousurl: string;

  estado: string;

  constructor(
    public conceptosService: ConceptosService,
    public pedidosService: PedidosService,
    private router: Router
  ) {
    this.previousurl = router['transitions'].value.currentSnapshot.url;
   }

  ngOnInit() {
  }

  isNumberKey( evt ) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }



}
