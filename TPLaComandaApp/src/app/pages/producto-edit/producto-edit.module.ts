import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductoEditPageRoutingModule } from './producto-edit-routing.module';

import { ProductoEditPage } from './producto-edit.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductoEditPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProductoEditPage]
})
export class ProductoEditPageModule {}
