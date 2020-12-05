import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisarClientesPage } from './supervisar-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisarClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisarClientesPageRoutingModule {}
