import { Component, OnInit } from '@angular/core';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit {

  /*
  nombreApellido: Animation;
  icono: Animation;
  division: Animation;
  */
  constructor(private animationCtrl: AnimationController) {
  }

  ngOnInit() {
    /*
    this.nombreApellido = this.animationCtrl.create()
      .addElement(document.querySelector('.titulo-pps'))
      .duration(4000)
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.25, transform: 'scale(0.5)' },
        { offset: 0.4, transform: 'translateY(280px)' },
        { offset: 0.5, transform: 'translateY(280px)' },
        { offset: 0.7, transform: 'scale(0.8)' },
        { offset: 1, transform: 'scale(1)' },
      ]);

    this.icono = this.animationCtrl.create()
      .addElement(document.querySelector('.icono'))
      .duration(4000)
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.25, transform: 'scale(0.5)' },
        { offset: 0.4, transform: 'translateY(-160px)' },
        { offset: 0.5, transform: 'translateY(-160px)' },
        { offset: 0.7, transform: 'scale(0.8)' },
        { offset: 1, transform: 'scale(1)' },
      ]);

    this.division = this.animationCtrl.create()
      .addElement(document.querySelector('.apellidos'))
      .duration(4000)
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.25, transform: 'scale(1.5)' },
        { offset: 0.4, transform: 'translateY(-100px)' },
        { offset: 0.5, transform: 'translateY(-100px)' },
        { offset: 0.7, transform: 'scale(0.8)' },
        { offset: 1, transform: 'scale(1)' },
      ]);

    const parent = this.animationCtrl.create()
      .duration(2000)
      .iterations(Infinity)
      .addAnimation([this.nombreApellido, this.icono, this.division]);

    parent.play();
    */
  }

  play(){
  }

}
