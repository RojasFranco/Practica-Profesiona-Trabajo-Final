import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HomeService } from 'src/app/services/home.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private navCtrl: NavController,
    public homeService: HomeService,
    private authService: AuthService) {

  }

  async ngOnInit() {
    this.homeService.mostrarMenuUsuario();
  }

  showPage(url: string) {
    this.navCtrl.navigateRoot(url);
  }

  logout() {
    this.authService.logout();
  }

}
