import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { CamaraService } from 'src/app/services/camara.service';
import { ConceptosService } from '../../services/concepto.service';

declare var window: any;

@Component({
  selector: 'app-input-camera-img',
  templateUrl: './input-camera-img.component.html',
  styleUrls: ['./input-camera-img.component.scss'],
})
export class InputCameraImgComponent implements OnInit {

  @Input() isEdit: boolean;

  post = {
    mensaje: '',
    posicion: false
  };

  constructor(
    private camara: CamaraService,
    public conceptosService: ConceptosService,
    private alertController: AlertController,
    ) { }

  async ngOnInit() {
    console.log('ngOnit');
  }

  ionViewWillEnter() {
    console.log('enter');
  }

  async openCamera() {
    try{
      await this.camara.AgregarNuevaFoto();
      if (this.camara.photos.length > 0){
        this.conceptosService.tempImages.push(this.camara.photos[0].webviewPath);
      }
      console.log(this.conceptosService.tempImages);
    }
    catch (error){
      if (error !== 'User cancelled photos app'){
        this.alertError('ALGO PASO: ' + error);
      }
    }
  }

  async alertError(mensaje: string){
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'alertCustomCss',
    });
    await alert.present();
  }

  deleteImg(index) {
    this.conceptosService.tempImages.splice(index, 1);
    let agregar = true;
    for (const iterator of this.conceptosService.arrayIndex) {
      if (iterator === index) {
        agregar = false;
      }
    }
    if (agregar) {
      this.conceptosService.arrayIndex.push(index);
    }
    console.log(this.conceptosService.arrayIndex);
  }

}
