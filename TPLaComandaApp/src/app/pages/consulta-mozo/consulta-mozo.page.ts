import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { CloudFirestoreService } from 'src/app/services/cloud-firestore.service';
import { HomeService } from 'src/app/services/home.service';
import { PushNotificationService } from '../../services/push-notification.service';

@Component({
  selector: 'app-consulta-mozo',
  templateUrl: './consulta-mozo.page.html',
  styleUrls: ['./consulta-mozo.page.scss'],
})
export class ConsultaMozoPage implements OnInit {

  idUsuarioActual: string;
  nombreUsuarioActual: string;
  nroMesa: string;
  listaMensajes: Array<any>;
  mensajeNuevo: string;
  mesaElegida: boolean = false;
  todasLasMesas: Array<string>;
  rolUsuario: string;
  tipoUsuario: string;
  clienteID: string;
  constructor(private auth: AuthService,
              private cloud: CloudFirestoreService,
              private db: AngularFirestore,
              private homeService: HomeService,
              private router: Router,
              private pushNotificationService: PushNotificationService) { 
      this.listaMensajes = new Array<any>();
  }

  ngOnInit() {
    this.CargarUsuario()
  }
    
    // PARA PROBAR
    // this.idUsuarioActual = "hnisKem9mVaYjdWsCd6M85hgIX93";
    // this.nombreUsuarioActual = "Rodrigo";
    // this.rolUsuario = "cliente"; 
  CargarUsuario(){
    this.mesaElegida = null;
    this.listaMensajes = [];
    this.auth.ObtenerActual().subscribe(rta=>{
      this.idUsuarioActual = rta.id;
      this.nombreUsuarioActual = rta.get("nombre");
      this.rolUsuario = rta.get("role");
      this.tipoUsuario = rta.get("tipo");
      if(this.rolUsuario=="cliente"||this.rolUsuario=="cliente_anonimo"){
        this.cloud.ObtenerTodosTiempoReal("mesas").subscribe(snap=>{
          snap.forEach(rta=>{
            this.clienteID = rta.payload.doc.get('cliente');
            if(rta.payload.doc.get("cliente")==this.idUsuarioActual){
              this.nroMesa = rta.payload.doc.id;
              this.mesaElegida = true;
              this.CargarMensajesMesa(this.nroMesa);
            }
          })
          if(!this.nroMesa){
            alert("Error: No tiene mesa asignada");
          }
        })        
      }
      else if(this.tipoUsuario=="mozo"||this.tipoUsuario=="metre"){ // MOZO
        this.todasLasMesas = [];
        this.cloud.ObtenerTodosTiempoReal("mesas").subscribe(snap=>{
          snap.forEach(mesa=>{
            this.todasLasMesas.push(mesa.payload.doc.id);
          })
        })
      }
      else{
        alert("Error con el rol del usuario");
      }
    })
  }

  ElegirMesa(nroMesaElegida: string){
    this.nroMesa = nroMesaElegida;
    this.mesaElegida = true;
    this.CargarMensajesMesa(this.nroMesa);
  }

  CargarMensajesMesa(idMesa: string){
    this.db.collection("mesas").doc(idMesa).collection("consultas").snapshotChanges().subscribe(snap=>{      
      this.listaMensajes = [];
      snap.forEach(rta=>{
        let payload = rta.payload.doc;
        let mensaje = {
          usuario: payload.get("usuario"),
          nombre: payload.get("nombre"),
          mensaje: payload.get("mensaje"),
          fecha: payload.get("fecha_hora"),
          time: payload.get("tiempo")
        };
        this.listaMensajes.push(mensaje);
      });
      //    TENGO QUE ORDENAR DE MENOR A MAYOR
      this.listaMensajes= this.listaMensajes.sort(this.OrdenarPorTiempo);
    })
  }

  OrdenarPorTiempo(a,b){
    if(a.time<b.time){
      return -1;
    }
    else if(a.time>b.time){
      return 1;
    }
    return 0;
  }


  async AgregarMje(){
    let date = new Date();
    let mensajeGuardar = {
      usuario: this.idUsuarioActual,
      mensaje: this.mensajeNuevo,
      nombre: this.nombreUsuarioActual,
      tiempo: date.getTime(),
      fecha_hora: this.convertDate(date)+'  '+ this.converHours(date)+'hs',
    };
    this.db.collection("mesas").doc(this.nroMesa).collection("consultas").add(mensajeGuardar);
    
    if (this.tipoUsuario === 'mozo' || this.tipoUsuario === 'metre') {
      this.pushNotificationService.sendUserIDsUsuario('Tiene un nuevo mensaje del mozo', this.clienteID);
    } else if (this.rolUsuario === 'cliente' || this.rolUsuario === 'cliente_anonimo') {
      this.pushNotificationService.sendUserIDsEmpleado(`Tiene un nuevo mensaje de la mesa ${this.nroMesa}`, 'mozo');
    }
    this.mensajeNuevo="";
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
  }

  converHours(inputFormat){
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getHours()), pad(d.getMinutes())].join(':')
  }

  Volver(){
    // this.homeService.mostrarMenuUsuario();
    this.router.navigate(['home']);
  }
}
