import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMesasPage } from './home-mesas.page';

const routes: Routes = [
  {
    path: '',
    component: HomeMesasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeMesasPageRoutingModule {}
