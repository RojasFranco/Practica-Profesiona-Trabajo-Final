import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CloudFirestoreService } from 'src/app/services/cloud-firestore.service';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.page.html',
  styleUrls: ['./juegos.page.scss'],
})
export class JuegosPage implements OnInit {

  // nuevoJuego: JuegoPiedraPapelTijera;
  nombreJuego: string;
  opcionElegida: string;
  opcionesDisponibles: Array<string>;
  opcionAleatoria: string;
  estaEnJuego: boolean=false;
  srcInicial: string = "../../../assets/img/signoPregunta.jpg";
  srcPiedra: string="../../../assets/img/piedra.png";
  srcPapel: string = "../../../assets/img/papel.png";
  srcTijera: string = "../../../assets/img/tijera.png";
  srcMaquina: string;
  srcJugador: string;
  ocultarMostrarError: boolean = true;
  resultadoJuego: string;
  claseResultado: string;
  yaTieneDescuento: boolean = false;
  idUsuarioActual: string;
  constructor(
    private cloud: CloudFirestoreService,
    private router: Router,
    private auth: AuthService) { 
    this.nombreJuego = "PPT";
    this.srcMaquina = this.srcInicial;
    this.srcJugador=this.srcInicial;
    this.opcionesDisponibles = new Array();
    this.opcionesDisponibles.push("piedra", "papel", "tijera");    
  }

  ngOnInit(){
    // this.idUsuarioActual = this.auth.getUIDUserLoggeado();
    this.idUsuarioActual = "GJAj7FS62nYBdwXjsGO7niRsb4T2";
    this.cloud.ObtenerTodosTiempoReal("encuestas").subscribe(snap=>{
      snap.forEach(rta=>{
        if(rta.payload.doc.id==this.idUsuarioActual){
          if(rta.payload.doc.get("descuento")){
            this.yaTieneDescuento = true;
          }
        }
      })
    })
  }

  Jugar(){
    this.estaEnJuego=true;
    this.srcJugador = this.srcInicial;
    this.srcMaquina = this.srcInicial;
    this.resultadoJuego=null;
    this.opcionAleatoria=null;
    // this.nuevoJuego.opcionElegida=null;
  }

  Verificar(){
    this.opcionAleatoria = this.opcionesDisponibles[Math.floor(Math.random()*3)]
    if(this.opcionElegida){ 
      this.ocultarMostrarError = true;     
      this.estaEnJuego=false;    
      this.srcJugador = this.DevolverSrcSegunOpcion(this.opcionElegida);
      this.srcMaquina = this.DevolverSrcSegunOpcion(this.opcionAleatoria);
      this.resultadoJuego = this.ValidarResultado(this.opcionElegida, this.opcionAleatoria);
      if(this.resultadoJuego.toLowerCase()=="ganaste"){
        this.ActualizarInformacionBD();
        this.claseResultado = "txtVerde";
      }
      else if(this.resultadoJuego.toLowerCase()=="perdiste"){
        // this.ActualizarInformacionBD(false);
        this.claseResultado = "txtRojo";
      }
    }    
    else{
      this.ocultarMostrarError = false;
    }
  }

  DevolverSrcSegunOpcion(datoValidar){
    let retorno: string;
    switch (datoValidar) {
      case "piedra":
        retorno =  this.srcPiedra;
        break;
      case "papel":
        retorno = this.srcPapel
        break;
      default:
        retorno = this.srcTijera
        break;
    }
    return retorno;
  }

  ValidarResultado(opcionJugador: string, opcionMaquina: string){
    let resultado: string;
    switch (opcionJugador) {
      case "piedra":
        if(opcionMaquina=="tijera"){
          resultado= "Ganaste"
        }
        else if(opcionMaquina=="papel"){
          resultado = "Perdiste"
        }
        else{
          resultado = "Empate"
          this.claseResultado = "txtGris";
        }
        break;
      case "papel":
        if(opcionMaquina=="tijera"){
          resultado= "Perdiste"
        }
        else if(opcionMaquina=="papel"){
          resultado = "Empate"
          this.claseResultado = "txtGris";
        }
        else{
          resultado = "Ganaste"
        }
        break;
      default:
        if(opcionMaquina=="tijera"){
          resultado= "Empate"
        }
        else if(opcionMaquina=="papel"){
          resultado = "Ganaste"
        }
        else{
          resultado = "Perdiste"
        }
        break;
    }
    return resultado;
  }

  elegirPiedra(){
    this.opcionElegida = "piedra";
  }

  elegirPapel(){
    this.opcionElegida = "papel";
  }

  elegirTijera(){
    this.opcionElegida = "tijera";
  }

  async ActualizarInformacionBD(){
    this.cloud.Actualizar("encuestas", this.idUsuarioActual, {descuento: 5});
  }

  Volver(){
    this.router.navigate(['home-mesas']);
  }

}
