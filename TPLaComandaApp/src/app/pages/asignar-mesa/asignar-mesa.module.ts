import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignarMesaPageRoutingModule } from './asignar-mesa-routing.module';

import { AsignarMesaPage } from './asignar-mesa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignarMesaPageRoutingModule
  ],
  declarations: [AsignarMesaPage]
})
export class AsignarMesaPageModule {}
