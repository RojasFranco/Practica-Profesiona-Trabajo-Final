import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/usuario-model';
import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  usuario: UsuarioModel = new UsuarioModel();

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private router: Router,
    public alertController: AlertController) {
    this.form = new FormGroup({
      mail: new FormControl(null, [
                                    Validators.required,
                                    Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
                                  ]),
      password: new FormControl(null, [
                                     Validators.required,
                                     Validators.minLength(6)
                                    ])
    });
  }

  ngOnInit() {
  }

  async login(){

    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null,
    });

    loading.present();

    const result = await this.authService.login(this.usuario);
    if (result) {
      this.authService.ObtenerActual().subscribe(async rta=>{
        let data = rta.data();
        if(data.role == "cliente" && !data.aprobado){
          const alert = await this.alertController.create({
            message: 'Su cuenta no se encuentra aprobada.',
            buttons: ['OK'],
            cssClass: 'alertCustomCss',
          });
          await alert.present();
        }
        else{
          this.navCtrl.navigateRoot('/home', { animated: true });
        }
      })
      loading.dismiss();      
    }
    else{
      loading.dismiss();
      const alert = await this.alertController.create({
        message: 'Los datos no son correctos.',
        buttons: ['OK'],
        cssClass: 'alertCustomCss',
      });
      await alert.present();
    }
  }

  limpiar() {
    this.form.reset();
    console.log(this.form);
  }

  LoginUser(usuario: UsuarioModel){
    this.usuario = usuario;
    this.login();
  }

  IrRegistro(){
    this.router.navigate(['registro']);
  }

}
