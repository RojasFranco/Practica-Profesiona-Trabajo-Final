import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() urlBack = '/';

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  goToPagina() {
    this.navCtrl.navigateForward(this.urlBack);
  }

}
