import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { CloudFirestoreService } from 'src/app/services/cloud-firestore.service';
import { HomeService } from 'src/app/services/home.service';
import { PushNotificationService } from '../../services/push-notification.service';

@Component({
  selector: 'app-scanner-solicitar-mesa',
  templateUrl: './scanner-solicitar-mesa.page.html',
  styleUrls: ['./scanner-solicitar-mesa.page.scss'],
})
export class ScannerSolicitarMesaPage implements OnInit {

  estaEnEspera: boolean = false;
  errorCodigo: boolean = false;
  // usuarioActual;  //si necesita guardar algun dato del usuario
  idUsuarioActual: string;
  nombreUserActual: string;
  roleUserActual: string;
  // idElementoAgregado: string;
  constructor(private barcodeScanner: BarcodeScanner,
              private cloud: CloudFirestoreService,
              private auth: AuthService,
              private db: AngularFirestore,
              public toastController: ToastController,
              private homeService: HomeService,
              private router: Router,
              private pushNotificationService: PushNotificationService) { }

  async ngOnInit() {
    this.auth.ObtenerActual().subscribe(rta=>{
      this.idUsuarioActual = rta.id;
      this.nombreUserActual = rta.get("nombre"); 
      this.roleUserActual = rta.get("role");   
      this.db.collection("listaEspera").doc(this.idUsuarioActual).snapshotChanges().subscribe(snap=>{
        if(snap.payload.exists){
          this.estaEnEspera = true;
        }
        else{
          this.estaEnEspera = false;
        }
      })
    });    
  }

  async scanner(){
    this.barcodeScanner.scan().then(async barcodeData => {
      if (!barcodeData.cancelled) {        
        this.VerificarScan(barcodeData.text);        
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }

  async VerificarScan(codigo: string){
    this.errorCodigo = false;
    if(codigo == "solicitar_mesa"){
      let elementoAgregar = {
        nombre: this.nombreUserActual,
        role: this.roleUserActual
      };
      this.cloud.AgregarConId("listaEspera", this.idUsuarioActual, elementoAgregar);
      this.estaEnEspera = true;
      this.pushNotificationService.sendUserIDsEmpleado('Nuevo cliente en la lista de espera.', 'metre');
      this.cloud.ObtenerTodosTiempoReal("mesas").subscribe(snap=>{
        snap.forEach(rta=>{
          if(rta.payload.doc.get("cliente")==this.idUsuarioActual && rta.payload.doc.get("estado")=="ocupada"){
            this.router.navigate(['home']);
            this.toastCuentaRegistrada();
          }
        })
      })
    }
    else{
      this.errorCodigo = true;
    }
  }

  Cancelar(){
    this.cloud.Borrar("listaEspera", this.idUsuarioActual);
    this.router.navigate(['home']);
  }

  Volver(){
    this.router.navigate(['home']);
  }

  async toastCuentaRegistrada() {
    const toast = await this.toastController.create({
      message: 'Solicitud de mesa aprobada',
      duration: 3000,
      position: "bottom",
      color: "primary"
    });
    toast.present();
  }
}
