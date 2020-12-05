import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { ConceptosService } from '../../services/concepto.service';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { CloudFirestoreService } from 'src/app/services/cloud-firestore.service';

@Component({
  selector: 'app-producto-create',
  templateUrl: './producto-create.page.html',
  styleUrls: ['./producto-create.page.scss'],
})
export class ProductoCreatePage implements OnInit {

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
    this.title = homeService.tipoEmpleado === 'cocinero' ? 'Alta de platos' : 'Alta de bebidas';

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
    this.conceptosService.tempImages = [];
  }

  async addConcepto() {

    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null
    });
    loading.present();

    this.concepto.imgs = [];
    for (const iterator of this.conceptosService.tempImages) {
      const response = await fetch(iterator);
      const blobImg = await response.blob();
      this.concepto.imgs.push(await this.cloud.AgregarImagen(blobImg));
    }

    this.concepto.categoria = this.homeService.tipoEmpleado === 'cocinero' ? 'plato' : 'bebidas';

    const result = await this.conceptosService.createConcepto(this.concepto);

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

  refresh() {

  }

}
