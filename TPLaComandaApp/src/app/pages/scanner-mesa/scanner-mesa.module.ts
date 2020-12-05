import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScannerMesaPageRoutingModule } from './scanner-mesa-routing.module';

import { ScannerMesaPage } from './scanner-mesa.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannerMesaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ScannerMesaPage]
})
export class ScannerMesaPageModule {}
