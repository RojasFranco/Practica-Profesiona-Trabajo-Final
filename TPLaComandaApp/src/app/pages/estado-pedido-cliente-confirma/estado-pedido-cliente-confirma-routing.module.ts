import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoPedidoClienteConfirmaPage } from './estado-pedido-cliente-confirma.page';

const routes: Routes = [
  {
    path: '',
    component: EstadoPedidoClienteConfirmaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadoPedidoClienteConfirmaPageRoutingModule {}
