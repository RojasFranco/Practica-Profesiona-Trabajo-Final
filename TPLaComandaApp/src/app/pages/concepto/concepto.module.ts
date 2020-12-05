import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConceptoPageRoutingModule } from './concepto-routing.module';

import { ConceptoPage } from './concepto.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConceptoPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [ConceptoPage]
})
export class ConceptoPageModule {}
