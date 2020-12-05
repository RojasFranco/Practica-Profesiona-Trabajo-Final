import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoMozoConfirmaPagoPage } from './pedido-mozo-confirma-pago.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoMozoConfirmaPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoMozoConfirmaPagoPageRoutingModule {}
