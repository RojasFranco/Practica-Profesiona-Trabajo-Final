import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoMozoConfirmaPagoPageRoutingModule } from './pedido-mozo-confirma-pago-routing.module';

import { PedidoMozoConfirmaPagoPage } from './pedido-mozo-confirma-pago.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoMozoConfirmaPagoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PedidoMozoConfirmaPagoPage]
})
export class PedidoMozoConfirmaPagoPageModule {}
