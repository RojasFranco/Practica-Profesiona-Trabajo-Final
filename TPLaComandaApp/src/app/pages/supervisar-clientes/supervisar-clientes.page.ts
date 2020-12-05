import { Component, OnInit } from '@angular/core';
import { SupervisarClientesService } from '../../services/supervisar-clientes.service';
import { IClienteASupervisarUID } from '../../clases/usuario';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervisar-clientes',
  templateUrl: './supervisar-clientes.page.html',
  styleUrls: ['./supervisar-clientes.page.scss'],
})
export class SupervisarClientesPage implements OnInit {
  //listaClientes: Observable<IClienteASupervisarUID[]>;
  lista: IClienteASupervisarUID[];
  //bandera: Promise<boolean>;

  constructor(
    private supervisarClientesService: SupervisarClientesService,
    private router: Router
  ) {
    this.supervisarClientesService.crearNuevaLista().subscribe((snap)=>{
      this.lista = [];
      snap.forEach(element => {
        if(element.payload.doc.get("estado") == "esperando"){
          let nuevoCliente: IClienteASupervisarUID = {
            uid: element.payload.doc.id,
            nombre: element.payload.doc.get("nombre"),
            email: element.payload.doc.get("email"),
            estado: element.payload.doc.get("estado")
          }
          this.lista.push(nuevoCliente);
        }
      });
    });
   }

  ngOnInit() {
  }

  public cambiarEstado(cliente: IClienteASupervisarUID, nuevoEstado: string){
    this.supervisarClientesService.cambiarEstado(cliente, nuevoEstado);
  }

  public irAtras(){
    this.router.navigateByUrl("/home");
  }
}
