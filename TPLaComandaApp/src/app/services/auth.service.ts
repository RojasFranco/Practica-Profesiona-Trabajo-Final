import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { NavController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { UsuarioModel } from '../models/usuario-model';
import { CloudFirestoreService } from './cloud-firestore.service';
import { PushNotificationService } from './push-notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
              private ngFireAuth: AngularFireAuth,
              private navCtrl: NavController,
              private cloud: CloudFirestoreService,
              private afs: AngularFirestore,
              private pushNotificationService: PushNotificationService
  ) { }

  async login(usuario: UsuarioModel) {

    return new Promise ( resolve =>
      { this.ngFireAuth.auth.signInWithEmailAndPassword(usuario.mail, usuario.password)
        .then((res) => {
          console.log(res);
          this.pushNotificationService.guardarUserID(res.user.uid);
          resolve(true);
        }).catch((error) => {
          resolve(false);
        });
    });
  }

  logout() {
    this.navCtrl.navigateRoot('/login', {animated: true});
    this.ngFireAuth.auth.signOut();
  }

  ObtenerActual(){
    // return this.ngFireAuth.auth.currentUser;
    //  let mailUser = this.ngFireAuth.auth.currentUser.email;
    let idUser = this.ngFireAuth.auth.currentUser.uid;
    return this.cloud.ObtenerUno("usuarios", idUser);    
  }

  RegistrarUsuario(usuario: UsuarioModel){
    return this.ngFireAuth.auth.createUserWithEmailAndPassword(usuario.mail, usuario.password);
  }

  EnviarMailVerificacion(){
    return this.ngFireAuth.auth.currentUser.sendEmailVerification();
    // return (await this.auth.currentUser).sendEmailVerification();
  }

  /* True si esta verificado, false sino */
  VerificoMail(){
    return this.ngFireAuth.auth.currentUser.emailVerified;
    // return (await this.auth.currentUser).emailVerified;
  }

  /** Obtiene el UID del usuario que se encuentra loggedo en este momento*/
  getUIDUserLoggeado(): string{
    return this.ngFireAuth.auth.currentUser.uid;
  }

  
}
