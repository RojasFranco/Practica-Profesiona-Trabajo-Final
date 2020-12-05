import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { CloudFirestoreService } from 'src/app/services/cloud-firestore.service';
import { ConceptosService } from 'src/app/services/concepto.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-producto-edit',
  templateUrl: './producto-edit.page.html',
  styleUrls: ['./producto-edit.page.scss'],
})
export class ProductoEditPage implements OnInit {

  concepto = {
    categoria: '',
    descripcion: '',
    estado: 'habilitado',
    imgs: [],
    nombre: '',
    precio: '0',
    seccion: '',
    tiempo: '0'
  };

  form: FormGroup;

  title: string;

  constructor(
    private navCtrl: NavController,
    private homeService: HomeService,
    public conceptosService: ConceptosService,
    private loadingCtrl: LoadingController,
    private cloud: CloudFirestoreService,
    public alertController: AlertController
  ) {
    this.title = homeService.tipoEmpleado === 'cocinero' ? 'Editar plato' : 'Editar bebida';

    this.form = new FormGroup({
      nombre: new FormControl(null, [
                                    Validators.required,
                                    Validators.minLength(3)
                                  ]),
      precio: new FormControl('0', [
                                     Validators.required
                                    ]),
      tiempo: new FormControl('0', [
                                      Validators.required
                                    ]),
      seccion: new FormControl(null, [
                                      Validators.required,
                                      Validators.minLength(3)
                                     ]),
      descripcion: new FormControl('')
    });
   }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.setConcepto();
  }

  async editConcepto() {

    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null
    });
    loading.present();

    this.concepto.imgs = [];
    for (const iterator of this.conceptosService.tempImages) {
      this.concepto.imgs.push(iterator);
    }

    let contador = 2;
    for (const iterator of this.conceptosService.arrayIndex) {
      const response = await fetch(this.conceptosService.tempImages[contador]);
      const blobImg = await response.blob();
      this.concepto.imgs[contador] = await this.cloud.AgregarImagen(blobImg);
      contador --;
    }

    const result = await this.conceptosService.updateConcepto(this.conceptosService.concepto.docID, this.concepto);

    if (result === true) {
      loading.dismiss();
      this.navCtrl.navigateRoot('/productos', { animated: true });
    }else {
      loading.dismiss();
      const alert = await this.alertController.create({
        message: 'Los datos no son correctos.',
        buttons: ['OK'],
        cssClass: 'alertCustomCss',
      });
      await alert.present();
    }


  }

  setConcepto() {
    this.concepto.categoria = this.conceptosService.concepto.categoria;
    this.concepto.descripcion = this.conceptosService.concepto.descripcion;
    this.concepto.estado = this.conceptosService.concepto.estado;
    this.concepto.imgs = this.conceptosService.concepto.imgs;
    this.concepto.nombre = this.conceptosService.concepto.nombre;
    this.concepto.precio = this.conceptosService.concepto.precio;
    this.concepto.seccion = this.conceptosService.concepto.seccion;
    this.concepto.tiempo = this.conceptosService.concepto.tiempo;
    this.conceptosService.tempImages = this.conceptosService.concepto.imgs;
  }

}
