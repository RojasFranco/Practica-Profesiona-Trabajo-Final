import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenPageRoutingModule } from './orden-routing.module';

import { OrdenPage } from './orden.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [OrdenPage]
})
export class OrdenPageModule {}
