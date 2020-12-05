import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoCreatePage } from './producto-create.page';

const routes: Routes = [
  {
    path: '',
    component: ProductoCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoCreatePageRoutingModule {}
