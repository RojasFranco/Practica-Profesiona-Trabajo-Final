import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/usuario-model';

@Component({
  selector: 'app-button-flotating',
  templateUrl: './button-flotating.component.html',
  styleUrls: ['./button-flotating.component.scss'],
})
export class ButtonFlotatingComponent implements OnInit {

  usuarioModel = new UsuarioModel();

  @Output() usuario: EventEmitter<UsuarioModel>;

  constructor(private authService: AuthService) {
    this.usuario = new EventEmitter();
  }

  ngOnInit() {}

  login(id: number) {

    this.usuarioModel.password = '123456';
    switch (id) {
      case 1:
        this.usuarioModel.mail = 'luis_supervisor@gmail.com';
        break;
      case 2:
        this.usuarioModel.mail = 'rodrigo_bartender@gmail.com';
        break;
      case 3:
        this.usuarioModel.mail = 'julieta_cocinero@gmail.com';
        break;
      case 4:
        this.usuarioModel.mail = 'rodrigo_usuario@gmail.com';
        break;
      case 5:
        this.usuarioModel.mail = 'carlos_mozo@gmail.com';
        break;
      case 6:
        this.usuarioModel.mail = 'laura_metre@gmail.com';
        break;
      default:
        break;
    }
    this.usuario.emit(this.usuarioModel);
  }

}
