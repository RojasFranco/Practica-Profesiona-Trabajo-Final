import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignarMesaPage } from './asignar-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: AsignarMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignarMesaPageRoutingModule {}
