import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ClienteModel } from 'src/app/models/cliente-model';
import { UsuarioModel } from 'src/app/models/usuario-model';
import { AuthService } from 'src/app/services/auth.service';
import { CamaraService } from 'src/app/services/camara.service';
import { CloudFirestoreService } from 'src/app/services/cloud-firestore.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { PushNotificationService } from '../../services/push-notification.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  usuario: UsuarioModel;
  cliente: ClienteModel;
  dniString: string;
  tipoRegisto: string;
  fotoSacada;
  loading;
  constructor(private router: Router,
              public alertController: AlertController,
              private auth: AuthService,
              private camara: CamaraService,
              private barcodeScanner: BarcodeScanner,
              private loadingCtrl: LoadingController,
              public toastController: ToastController,
              private cloud: CloudFirestoreService,
              private pushNotificationService: PushNotificationService) { 
    this.usuario = new UsuarioModel();
    this.cliente = new ClienteModel();
  }

  ngOnInit() {
  }

  Escanear(){
    
    let options = {
      formats: "PDF_417",
    };
    this.barcodeScanner.scan(options).then(barcodeData => {
      if(barcodeData.text!=""){
        this.CargarDatosQr(barcodeData.text);
      }
     }).catch(err => {
         alert('Error: '+ err);
     });
  }

  CargarDatosQr(textoQr: string){
    let listDatos = textoQr.split('@');
    this.cliente.apellido = listDatos[1];
    this.cliente.nombre = listDatos[2];
    this.dniString = listDatos[4];
    this.cliente.dni = parseInt(listDatos[4]);
  }

  async Registrar(){
    this.loading = await this.loadingCtrl.create({
      message: 'Por favor espere...'
    });
    this.loading.present();

    if(this.tipoRegisto){
      if(this.usuario.mail && this.usuario.password && this.fotoSacada){
        if(this.cliente.nombre){                  
          if(this.tipoRegisto == "anonimo"){
            this.RegistroFirebase(this.usuario);
          }
          else{
            this.VerificarCliente();
          }
        }
        else{
          this.alertError("Complete su nombre");
        }
      }
      else{
        this.alertError("Correo, contraseña, y foto son necesarios");
      }
    }
    else{
      this.alertError("Seleccione el tipo de registro");
    }
  }

  async VerificarCliente(){
    if(this.cliente.dni.toString().length>0){
      this.dniString = this.cliente.dni.toString();
    }
    if(this.cliente.apellido && this.dniString){
      if(this.dniString.length<10){
        if(this.TieneSoloNros(this.dniString)){
          this.cliente.dni = parseInt(this.dniString);          
          this.RegistroFirebase(this.usuario);    
        }              
        else{
          this.alertError("El dni solo puede tener numeros");
        }
      }
      else{
        this.alertError("El dni no puede tener mas de 9 caracteres");
      }
    }
    else{
      this.alertError("Complete apellido y dni");
    }
  }

  async RegistroFirebase(usuario: UsuarioModel){
    try{
      let userRegistrado = await this.auth.RegistrarUsuario(usuario);
      const response = await fetch(this.fotoSacada);
      const blobImg = await response.blob();
      this.cliente.foto = await this.cloud.AgregarImagen(blobImg);
      if(this.tipoRegisto=="anonimo"){
        this.AgregarClienteAnonimo(this.cliente, userRegistrado.user.uid);        
      }
      else{
        this.AgregarCliente(this.cliente, userRegistrado.user.uid);
      }
      this.toastCuentaRegistrada();
      this.router.navigate(['login']);
    }
    catch(error){
      switch (error.code) {
        case 'auth/invalid-email':
          this.alertError("Ingrese un correo electronico valido");
          break;
        case 'auth/weak-password':
          this.alertError("La contraseña debe tener al menos 6 caracteres");
          break;
        case 'auth/email-already-in-use':
          this.alertError("Este mail ya esta registrado");
          break;
        default:
          this.alertError("Error inesperado: "+error.message);
          break;
      }
    }
  }

  async SacarFoto(){
    try{
      await this.camara.AgregarNuevaFoto();
      if(this.camara.photos.length>0){
        this.fotoSacada = this.camara.photos[0].webviewPath;
      }
    }
    catch(error){
      if(error!="User cancelled photos app"){
        this.alertError("ALGO PASO: "+error);
      }
      //SINO SOLO CANCELO SUBIR FOTO
    }
  }

  AgregarCliente(cliente: ClienteModel, idGenerado: string){
    let clienteAgregar = {
      nombre:cliente.nombre,
      apellido: cliente.apellido,
      role: "cliente",
      dni: cliente.dni,
      foto: cliente.foto,
      aprobado: false,
      email: this.usuario.mail,
    };
    this.cloud.AgregarConId("usuarios", idGenerado, clienteAgregar);
    this.cloud.AgregarConId("clientesASupervisar", idGenerado, {
      nombre: cliente.nombre,
      email: this.usuario.mail,
      estado: "esperando"
    });
    this.pushNotificationService
          .sendUserIDs(`Nuevo cliente pendiente de aprobación`, 'supervisor');
    this.loading.dismiss();
  }

  AgregarClienteAnonimo(cliente: ClienteModel, idGenerado: string){
    let clienteAgregar = {
      nombre:cliente.nombre,
      role: "cliente_anonimo",
      foto: cliente.foto,
      email: this.usuario.mail,
    };
    this.cloud.AgregarConId("usuarios", idGenerado, clienteAgregar);
    this.loading.dismiss();
  }

  Limpiar(){
    this.usuario.mail = null;
    this.tipoRegisto = null;
    this.usuario.password = null;
    this.dniString = null;
    this.cliente.nombre = null;
    this.cliente.apellido = null;
    this.fotoSacada = null;
  }

  IrLogin(){
    this.router.navigate(['login']);
  }

  TieneSoloNros(dato: string){
    let nros = "0123456789";
    for (let index = 0; index < dato.length; index++) {
      const element = dato[index];
      if(!nros.includes(element)){
        return false;
      }      
    }
    return true;
  }

  async alertError(mensaje: string){
    this.loading.dismiss();
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'alertCustomCss',
    });
    await alert.present();
  }

  async toastCuentaRegistrada() {
    const toast = await this.toastController.create({
      message: 'Su cuenta ha sido registrada.',
      duration: 3000,
      position: "bottom",
      color: "primary"
    });
    toast.present();
  }

}
