import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadoPedidoClienteConfirmaPageRoutingModule } from './estado-pedido-cliente-confirma-routing.module';

import { EstadoPedidoClienteConfirmaPage } from './estado-pedido-cliente-confirma.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadoPedidoClienteConfirmaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EstadoPedidoClienteConfirmaPage]
})
export class EstadoPedidoClienteConfirmaPageModule {}
