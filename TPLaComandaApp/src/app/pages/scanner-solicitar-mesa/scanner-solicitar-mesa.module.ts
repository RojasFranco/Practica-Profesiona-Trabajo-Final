import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScannerSolicitarMesaPageRoutingModule } from './scanner-solicitar-mesa-routing.module';

import { ScannerSolicitarMesaPage } from './scanner-solicitar-mesa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannerSolicitarMesaPageRoutingModule
  ],
  declarations: [ScannerSolicitarMesaPage]
})
export class ScannerSolicitarMesaPageModule {}
