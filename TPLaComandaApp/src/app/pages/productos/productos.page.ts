import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ConceptosService } from 'src/app/services/concepto.service';
import Swal from 'sweetalert2';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  texto: '';
  listConcepto: Array<any> = [];
  listConceptoAux: Array<any> = [];

  constructor(
    private navCtrl: NavController,
    public conceptosService: ConceptosService,
    private homeService: HomeService,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    await this.conceptosService.getConceptos()
    .subscribe((snap) => {
      this.conceptosService.conceptos = [];
      this.listConceptoAux = [];
      snap.forEach(async (data: any) => {
        const concepto = data.payload.doc.data();
        concepto.docID = data.payload.doc.id;
        if (this.homeService.tipoEmpleado === 'cocinero' &&
        concepto.categoria === 'plato' &&
        concepto.estado === 'habilitado') {
          this.conceptosService.conceptos.push(concepto);
        }
        if (this.homeService.tipoEmpleado === 'bar tender' &&
        concepto.categoria === 'bebidas' &&
        concepto.estado === 'habilitado') {
          this.conceptosService.conceptos.push(concepto);
        }
      });
      console.log(this.conceptosService.conceptos);
      setTimeout(() => {
        const g = new Set(this.conceptosService.conceptos.map(i => i.seccion));
        this.listConcepto = [];
        g.forEach(x =>
          this.listConcepto.push({
            name: this.conceptosService.conceptos.filter(i => i.seccion === x)[0].seccion,
            values: this.conceptosService.conceptos.filter(i => i.seccion === x)
          }
        ));
        this.listConceptoAux = JSON.parse(JSON.stringify(this.listConcepto));
      }, 1500);
    });
  }

  buscarConcepto(event: any) {
    this.texto = event.detail.value;
  }

  async addConcepto() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null,
      duration: 2000
    });
    loading.present();
    this.navCtrl.navigateRoot('/producto-create');
  }

  async editConcepto(concepto) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null,
      duration: 2000
    });
    loading.present();
    this.conceptosService.concepto = concepto;
    this.conceptosService.arrayIndex = [];
    this.navCtrl.navigateRoot(`/producto-edit`);
  }

  async deleteConcepto(concepto) {
    Swal.fire({
      icon: 'warning',
      title: `¿Está seguro que desea eliminar este producto?`,
      text: `El producto ${concepto.nombre} será eliminado/a`,
      showCancelButton: true,
      confirmButtonColor: '#22BB33',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      // tslint:disable-next-line:no-debugger
      debugger;
      if (result.value) {
        const data = {
          categoria: concepto.categoria,
          descripcion: concepto.descripcion,
          estado: 'deshabilitado',
          imgs: concepto.imgs,
          nombre: concepto.nombre,
          precio: concepto.precio,
          seccion: concepto.seccion,
          tiempo: concepto.tiempo
        };
        const modificado = await this.conceptosService.updateConcepto(concepto.docID, data);
        if (modificado) {
          // show success
          Swal.fire(
            'Eliminado!',
            'Se elimino con éxito.',
            'success'
          );
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Error inesperado.'
          });
        }
      }
    });
  }

}
