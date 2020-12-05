import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CloudFirestoreService } from 'src/app/services/cloud-firestore.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-detalle-cuenta',
  templateUrl: './detalle-cuenta.page.html',
  styleUrls: ['./detalle-cuenta.page.scss'],
})
export class DetalleCuentaPage implements OnInit {

  idUserActual: string;
  listaPedidos: Array<any>;
  totalPagar: number;
  propina: number = 0;
  descuento: number = 0;
  mesaCliente: string;
  constructor(private cloud: CloudFirestoreService, 
              private auth: AuthService,
              private router: Router,
              private homeService: HomeService) { }

  async ngOnInit() {
    this.idUserActual = this.auth.getUIDUserLoggeado();
    this.cloud.ObtenerTodosTiempoReal("pedidos").subscribe(snap=>{
      this.listaPedidos = [];
      snap.forEach(rta=>{
        if(rta.payload.doc.get("usuarioDocID")==this.idUserActual){                    
          let payload = rta.payload.doc;
          this.mesaCliente = payload.get("mesaDocID");
          let detalles = payload.get("detallePedido");
          for (let index = 0; index < detalles.length; index++) {
            const detalle = detalles[index];
            let pedido = {
              total: payload.get("importeTotal"),
              producto: detalle.conceptoNombre,
              cantidad: detalle.cantidad,
              precioUnitario: detalle.importeUnitario,              
            };
            this.listaPedidos.push(pedido);
          }
        }
      });
      this.CalcularTotalPagar();
      this.VerificarEstadoMesa();
    });
  }

  CalcularTotalPagar(){
    this.totalPagar = 0;
    this.listaPedidos.forEach(pedido=>{
      this.totalPagar+=parseFloat(pedido.total);
    });
    this.cloud.ObtenerUno("encuestas", this.idUserActual).subscribe(rta=>{      
      if(rta.exists){
        let auxPropina = parseInt(rta.get("propina"));
        this.propina = (this.totalPagar*(auxPropina/100));
        
        let auxDto = parseInt(rta.get("descuento"));
        this.descuento = (this.totalPagar*(auxDto/100));

        // this.totalPagar += this.propina;
        // this.totalPagar-=this.descuento;
        this.totalPagar = this.totalPagar+this.propina-this.descuento;
      }
    });
  }

  VerificarEstadoMesa(){
    this.cloud.ObtenerTodosTiempoReal("mesas").subscribe(snap=>{
      snap.forEach(rta=>{
        if(rta.payload.doc.id==this.mesaCliente && rta.payload.doc.get("estado")=="libre"){
          this.homeService.solicitudMesaAceptada = false;
          this.homeService.puedeConsultar = false;
          this.router.navigate(['home-mesas']);
        }
      })
    })
  }

  Volver(){
    this.router.navigate(['home']);
  }
}
