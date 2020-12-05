import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMesasPageRoutingModule } from './home-mesas-routing.module';

import { HomeMesasPage } from './home-mesas.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMesasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [HomeMesasPage]
})
export class HomeMesasPageModule {}
