import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { EmpleadoService } from './empleado.service';

import { AsignarMesaService } from '../services/asignar-mesa.service';
import { AuthService } from '../services/auth.service';
import { CloudFirestoreService } from './cloud-firestore.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // propiedades provisoria
  //solicitudMesaAceptada = true;
  solicitudMesaAceptada: boolean;
  perfilAnonimo = true;
  tipoEmpleado = 'metre';
  nombre: string;
  puedeConsultar: boolean;

  // lista de botones del menu
  listaMenu: Menu[];

  private clienteCards: Menu[];

  private empleadoCards: Menu[];

  private supervisorCards: Menu[];

  constructor(
    private ngFireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private cloud: CloudFirestoreService,
    private empleadoService: EmpleadoService,
    private asignarMesaService: AsignarMesaService,
    private authSerice: AuthService
  ) {
    console.log('Entra al home');
    // this.asignarMesaService.getListaMesas().subscribe((lista) =>{
      // let clienteUID: string = this.authSerice.getUIDUserLoggeado();
      // let estaEnMesa: boolean = false;
      // lista.forEach((mesa) =>{
      //   if(mesa.cliente == clienteUID && mesa.estado !== "libre"){
      //     this.asignarMesaService.codigoMesaAsignada = mesa.id;
      //     estaEnMesa = true;
      //   }
      // });
      // this.solicitudMesaAceptada = estaEnMesa;
    // });
    let idUsuario;
    authSerice.ObtenerActual().subscribe(rta=>{
      idUsuario = rta.id;
      this.solicitudMesaAceptada=false;
      cloud.ObtenerTodosTiempoReal("mesas").subscribe(snap=>{
        snap.forEach(rta=>{
          if(rta.payload.doc.get("cliente")==idUsuario&& rta.payload.doc.get("estado")=="ocupada"){
            this.solicitudMesaAceptada=true;
          }
        })
      })
    })

  }


   getMenuCliente() {
     this.listaMenu = [];
     this.menuCliente();
     this.listaMenu = this.clienteCards;
   }

   getMenuEmpleado() {
     this.listaMenu = [];
     this.menuEmpleado();
     this.listaMenu = this.empleadoCards;
   }

   getMenuSupervisor() {
     this.listaMenu = [];
     this.menuSupervisor();
     this.listaMenu = this.supervisorCards;
   }

   menuCliente() {
    this.clienteCards = [
      {
        route: '/solicita-mesa',
        title: 'Solicita tu mesa', // cliente y anonimo
        icon: 'restaurant',
        class: !this.solicitudMesaAceptada ? 'icon_5px' : 'icon_4px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: !this.solicitudMesaAceptada
      },
      {
        route: '/scanner-mesa',
        title: 'Escanear mesa asignada', // cliente y anonimo
        icon: 'qr-code-outline',
        class: !this.solicitudMesaAceptada ? 'icon_5px' : 'icon_4px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: this.solicitudMesaAceptada
      },
      {
        route: '/consulta-mozo',
        title: 'Consulta al mozo', // cliente y anonimo
        icon: 'chatbubbles',
        class: !this.solicitudMesaAceptada ? 'icon_5px' : 'icon_4px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: this.puedeConsultar
      },
      /*{
        route: '/reserva',
        title: 'Hacé tu reserva', // cliente
        icon: 'calendar',
        class: !this.solicitudMesaAceptada ? 'icon_5px' : 'icon_4px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: true
      },
      {
        route: '/delivery',
        title: 'Hacé tu pedido y te lo llevamos', // cliente
        icon: 'bicycle',
        class: !this.solicitudMesaAceptada ? 'icon_5px' : 'icon_4px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: true
      }*/
    ];
   }

   menuEmpleado() {
     this.empleadoCards = [
      {
        route: '/productos',
        title: 'Alta de Producto', // cocinero o bartender
        icon: 'restaurant',
        class: 'icon_5px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: this.tipoEmpleado === 'cocinero' || this.tipoEmpleado === 'bar tender'
      },
      {
        route: '/cliente',
        title: 'Alta de cliente', // Metre
        icon: 'person-add',
        class: 'icon_5px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: this.tipoEmpleado === 'metre'
      },
      {
        route: '/mesa',
        title: 'Alta de Mesas', // Mozo
        icon: 'help-buoy',
        class: this.tipoEmpleado === 'mozo' ? 'icon_4px' : 'icon_5px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: this.tipoEmpleado === 'mozo'
      },
      {
        route: '/lista-pedidos',
        title: 'Lista de pedidos', // todos menos el metre
        icon: 'reader-outline',
        class: this.tipoEmpleado === 'mozo' ? 'icon_4px' : 'icon_5px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: this.tipoEmpleado !== 'metre'
      },
      {
        route: '/asignar-mesa',
        title: 'Lista de clientes en espera', // metre
        icon: 'reader-outline',
        class: 'icon_5px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: this.tipoEmpleado === 'metre'
      },
      {
        route: '/encuesta',
        title: 'Tomar pedido', // Mozo
        icon: 'reader-outline',
        class: this.tipoEmpleado === 'mozo' ? 'icon_4px' : 'icon_5px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: this.tipoEmpleado === 'mozo'
      },
      {
        route: '/encuesta',
        title: 'Encuesta empleado', // todos los empleados
        icon: 'list',
        class: 'icon_5px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: true
      },
      {
        route: '/consulta-mozo',
        title: 'Consultas de clientes', // mozo y metre?
        icon: 'chatbubbles',
        class: !this.solicitudMesaAceptada ? 'icon_5px' : 'icon_4px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: this.tipoEmpleado ==='mozo' || this.tipoEmpleado ==='metre'
      },
    ];
   }

   menuSupervisor() {
     this.supervisorCards = [
      {
        route: '/empleado',
        title: 'Alta de empleados', // Supervisor o dueño
        icon: 'person-add',
        class: 'icon_5px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: true
      },
      {
        route: '/mesa',
        title: 'Alta de mesas', // Supervisor o dueño
        icon: 'help-buoy',
        class: 'icon_5px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: true
      },
      {
        route: '/supervisar-clientes',
        title: 'Solicitud de clientes', // Supervisor o dueño
        icon: 'people',
        class: 'icon_5px',
        style: {'background-color': 'rgb(83 156 247)', 'align-text': 'center'},
        visible: true
      }
    ];
   }

   async mostrarMenuUsuario() {

    return new Promise ( resolve =>
      {
        const docID = this.ngFireAuth.auth.currentUser.uid;
        this.getUsers(docID).subscribe((snap) => {
          const user = snap.payload.data();
          this.nombre = user['nombre'];
          console.log(user);
          if (user['role'] === 'supervisor') {
            this.getMenuSupervisor();
          }
          if (user['role'] === 'empleado') {
            this.tipoEmpleado = user['tipo'];
            console.log(this.tipoEmpleado);
            this.empleadoService.tipo = this.tipoEmpleado;
            this.getMenuEmpleado();
          }
          if (user['role'] === 'cliente') {
            this.getMenuCliente();
            this.perfilAnonimo = false;
          }
          if (user['role'] === 'cliente_anonimo') {
            this.getMenuCliente();
            this.perfilAnonimo = true;
          }
        });
    });
  }

  getUsers(docID){
    return this.afs.collection('usuarios').doc(docID).snapshotChanges();
  }


}

export interface Menu {
  route: string;
  title: string;
  icon: string;
  class: string;
  style: object;
  visible: boolean;
}
