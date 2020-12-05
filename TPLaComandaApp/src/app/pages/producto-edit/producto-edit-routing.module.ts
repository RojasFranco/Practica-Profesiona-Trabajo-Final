import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoEditPage } from './producto-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ProductoEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoEditPageRoutingModule {}
