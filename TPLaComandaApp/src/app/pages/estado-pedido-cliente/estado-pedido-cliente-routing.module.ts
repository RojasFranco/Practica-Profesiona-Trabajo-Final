import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoPedidoClientePage } from './estado-pedido-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: EstadoPedidoClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadoPedidoClientePageRoutingModule {}
