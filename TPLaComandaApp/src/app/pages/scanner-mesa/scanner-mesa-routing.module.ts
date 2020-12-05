import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScannerMesaPage } from './scanner-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: ScannerMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScannerMesaPageRoutingModule {}
