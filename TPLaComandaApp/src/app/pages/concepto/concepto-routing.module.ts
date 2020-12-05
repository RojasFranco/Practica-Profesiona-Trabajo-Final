import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConceptoPage } from './concepto.page';

const routes: Routes = [
  {
    path: '',
    component: ConceptoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConceptoPageRoutingModule {}
