import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScannerSolicitarMesaPage } from './scanner-solicitar-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: ScannerSolicitarMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScannerSolicitarMesaPageRoutingModule {}
