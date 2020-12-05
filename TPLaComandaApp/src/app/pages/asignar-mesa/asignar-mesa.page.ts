import { Component, OnInit } from '@angular/core';
import { AsignarMesaService } from '../../services/asignar-mesa.service';
import { IClienteEspera, IClienteEsperaId } from '../../clases/usuario';
import { IMesa, IMesaID } from '../../clases/mesa';
import { Observable } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignar-mesa',
  templateUrl: './asignar-mesa.page.html',
  styleUrls: ['./asignar-mesa.page.scss'],
})
export class AsignarMesaPage implements OnInit {
  listaClientesEspera: Observable<IClienteEsperaId[]>;
  listaMesas: Observable<IMesaID[]>;
  listaMesasDisponibles: IMesaID[];
  hayMesasDisponibles: boolean;

  constructor(
    private asignarMesaService: AsignarMesaService,
    private actionSheetController: ActionSheetController,
    private router: Router
  ) { 
    this.listaClientesEspera = this.asignarMesaService.getListaClientesEspera();
    this.listaMesas = this.asignarMesaService.getListaMesas();
    this.listaMesas.subscribe((lista) => {
      this.listaMesasDisponibles = [];
      lista.forEach((mesa) =>{
        if(mesa.estado == "libre"){
          this.listaMesasDisponibles.push(mesa);
          this.hayMesasDisponibles = true;
        }
      });
    });
  }

  ngOnInit() {
    /*
    this.listaMesas.subscribe((data) => {
      console.log("LISTA MESAS DATA", data);
    });*/
    /*this.asignarMesaService.buscarMesaQR("mesa006").then((data) =>{
      console.log("Resultado de buscar mesa: ",data);
    });*/
    //this.algo();
    //this.probar();
  }


  async abrirMenu(cliente: IClienteEsperaId) {
    let botones = [];
    if(this.listaMesasDisponibles.length > 0){
      this.listaMesasDisponibles.forEach((mesa) => {
        botones.push({
          text: mesa.codigoqr,
          handler: () => {
            this.asignarMesaService.asignarClienteAMesa(cliente, mesa);
          }
        });
      });
    } else {
      botones.push({
        text: 'No hay mesas disponibles',
        handler: ()=>{
          console.log('No hay mesas disponibles');
        }
      })
    }
    botones.push({
        text: 'Volver',
        role: 'cancel',
        cssClass: 'customActionButton'
    });
    //console.log("Botones para el action sheet", botones);
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona una mesa',
      cssClass: 'customActionSheet',
      buttons: botones
    });
    await actionSheet.present();
  }

  
  async algo(){
    const prueba: boolean = await this.asignarMesaService.buscarMesaQR("mesa005");
    const qr: string = await this.asignarMesaService.traerString("mesa001");
    if(prueba){
      const pruebaDos: boolean = await this.asignarMesaService.buscarClienteEnMesa('prueba001', qr);
      console.log("Esta el cliente: ", pruebaDos);
      console.log("mesa encontrada");
    } else {
      console.log("mesa no encontrada");
    }
  }

  public probar(){
    this.asignarMesaService.probar();
  }

  public irAtras(){
    this.router.navigateByUrl("/home");
  }
}
