import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductoCreatePageRoutingModule } from './producto-create-routing.module';

import { ProductoCreatePage } from './producto-create.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductoCreatePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProductoCreatePage]
})
export class ProductoCreatePageModule {}
