import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroPipe } from './filtro.pipe';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';



@NgModule({
  declarations: [
    FiltroPipe,
    DomSanitizerPipe
  ],
  exports: [
    FiltroPipe,
    DomSanitizerPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
