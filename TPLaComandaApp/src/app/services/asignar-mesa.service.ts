import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IClienteEspera, IClienteEsperaId } from '../clases/usuario';
import { IMesa, IMesaID  } from '../clases/mesa';
import { rejects } from 'assert';
import { PushNotificationService } from './push-notification.service';

@Injectable({
  providedIn: 'root'
})
export class AsignarMesaService {
  coleccionListaEspera: AngularFirestoreCollection<IClienteEspera>;
  coleccionMesa: AngularFirestoreCollection<IMesa>;

  listaClientesEspera: Observable<IClienteEsperaId[]>;
  listaMesas: Observable<IMesaID[]>;

  codigoMesaAsignada: string;
  //listaMesasDisponibles: IMesaID[];
  //hayMesasDisponibles: boolean = false;
  //listaClientesEspera: IClienteEsperaId[];
  //listaMesas: IMesaID[];


  constructor(
    private dataBase: AngularFirestore,
    private pushNotificationService: PushNotificationService
  ) { 
    this.coleccionListaEspera = dataBase.collection<IClienteEspera>("listaEspera");
    this.coleccionMesa = dataBase.collection<IMesa>("mesas");
    this.traerMesas();
  }

  public traerListaEspera (){
    this.listaClientesEspera = this.coleccionListaEspera.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IClienteEspera;
        const uid = a.payload.doc.id;
        return {uid, ...data};
      }))
    );
  }

  public traerMesas(){
    this.listaMesas = this.coleccionMesa.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IMesa;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }

  /*
  public traerMesasDisponibles(){
    console.log("lista service", this.listaMesas);
    console.log("mesas service", this.listaMesasDisponibles);
  }
  */

  public getListaMesas(): Observable<IMesaID[]>{
    //this.traerMesas();
    return this.listaMesas;
  }

  /*
  public getListaMesasDisponibles(): IMesaID[]{
    this.traerMesas();

    return this.listaMesasDisponibles;
  }*/

  public getListaClientesEspera(): Observable<IClienteEsperaId[]>{
    this.traerListaEspera();
    return this.listaClientesEspera;
  }

  public asignarClienteAMesa(cliente: IClienteEsperaId, mesa: IMesaID): boolean{
    let retorno = false;
    try{
      let mesaModificada:IMesa = {
        codigoqr: mesa.codigoqr,
        estado: "ocupada",
        cliente: cliente.uid,
      };
      this.coleccionMesa.doc(mesa.id).update(mesaModificada);
      this.coleccionListaEspera.doc(cliente.uid).delete();
      retorno = true;
    }
    catch(error){
      console.log("Error al asignar el cliente a la mesa", error);
    }

    return retorno;
  }

  public liberarMesa(mesa: IMesaID): boolean{
    let retorno = false;
    try{
      let mesaModificada: IMesa = {
        codigoqr: mesa.codigoqr,
        estado: "libre",
        cliente: "esperando", 
      };
      this.coleccionMesa.doc(mesa.id).update(mesaModificada);
      retorno = true;
    }
    catch(error){
      console.log("Error al modificar la mesa", error);
    }

    return retorno;
  }

  public async buscarMesaQR(codigoQR: string): Promise<boolean>{
    let observador: Subscription;
    const terminado = await new Promise<boolean>((resolve, reject) => {
      observador = this.listaMesas.subscribe((lista) => {
        let bandera = true;
        lista.forEach((mesa)=>{
          if(mesa.codigoqr == codigoQR){
            bandera = false;
            resolve(true);
          }
        });
        if(bandera){
          resolve(false);
        }
      });
    });
    if(terminado == true || terminado == false){
      observador.unsubscribe();
      return terminado;
    }
  }

  public async buscarClienteEnMesa(clienteUID: string, codigoQR: string): Promise<boolean>{
    let observador: Subscription;
    const terminado = await new Promise<boolean>((resolve, reject) => {
      observador = this.listaMesas.subscribe((lista) => {
        let bandera = true;
        lista.forEach((mesa)=>{
          if(mesa.estado !== "libre" && mesa.cliente == clienteUID && mesa.codigoqr == codigoQR){
            bandera = false;
            resolve(true);
          }
        });
        if(bandera){
          this.pushNotificationService
          .sendUserIDs(`Nueva solicitud de mesa`, 'metre');
          resolve(false);
        }
      });
    });
    if(terminado == true || terminado == false){
      observador.unsubscribe();
      return terminado;
    }
  }

  public traerString(codigoQR: string): Promise<string>{

    return new Promise((resolve, reject) => {
      this.listaMesas.subscribe((lista) => {
        let bandera = true;
        lista.forEach((mesa)=>{
          if(mesa.codigoqr == codigoQR){
            bandera = false;
            resolve(mesa.codigoqr);
          }
        });
        if(bandera){
          resolve("error");
        }
      });
    });
  }

  async probar(){
    let datausuario;
    let observador: Subscription;
    const promesa = new Promise<boolean>((resolve, reject)=>{
      observador = this.dataBase.collection('usuarios').doc('yrSjBPQPT1Ztsfb5OvPjUyTFfOm2').valueChanges().subscribe((data) =>{
        datausuario = data;
        console.log("En observable", data);
        resolve(true);
      });  
    });
    if(await promesa == true){
      observador.unsubscribe();
      console.log("Data del usuario", datausuario);
    }
  }
}
