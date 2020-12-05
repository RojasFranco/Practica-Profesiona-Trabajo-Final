import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadoPedidoClientePageRoutingModule } from './estado-pedido-cliente-routing.module';

import { EstadoPedidoClientePage } from './estado-pedido-cliente.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadoPedidoClientePageRoutingModule,
    ComponentsModule
  ],
  declarations: [EstadoPedidoClientePage]
})
export class EstadoPedidoClientePageModule {}
