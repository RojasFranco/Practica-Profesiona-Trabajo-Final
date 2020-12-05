import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisarClientesPageRoutingModule } from './supervisar-clientes-routing.module';

import { SupervisarClientesPage } from './supervisar-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupervisarClientesPageRoutingModule
  ],
  declarations: [SupervisarClientesPage]
})
export class SupervisarClientesPageModule {}
