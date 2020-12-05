import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { database } from 'firebase';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IClienteASupervisar, IClienteASupervisarUID} from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class SupervisarClientesService {
  coleccionUsuarios: AngularFirestoreCollection;
  coleccionClientes: AngularFirestoreCollection<IClienteASupervisar>;
  listaClientes: Observable<IClienteASupervisarUID[]>;
  lista: IClienteASupervisarUID[] = [];

  constructor(
    private dataBase: AngularFirestore
  ) { 
    this.coleccionClientes = this.dataBase.collection<IClienteASupervisar>('clientesASupervisar');
    this.coleccionUsuarios = this.dataBase.collection('usuarios');
  }

  public traerClientes(){
    this.listaClientes = this.coleccionClientes.snapshotChanges().pipe(
      map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IClienteASupervisar;
          const uid = a.payload.doc.id;
          return {uid, ...data};
      }))
    );
  }

  public crearNuevaLista(){
    return this.coleccionClientes.snapshotChanges();
  }

  public getListaClientes(): Observable<IClienteASupervisarUID[]>{
    this.traerClientes();
    return this.listaClientes;
  }

  public async cambiarEstado(cliente: IClienteASupervisarUID, nuevoEstado:string){
    let clienteModificado: IClienteASupervisar = {
      email: cliente.email,
      nombre: cliente.nombre,
      estado: nuevoEstado
    }
    this.coleccionClientes.doc(cliente.uid).update(clienteModificado);
    let dataUsuario;
    let observador: Subscription;
    const promesa = new Promise<boolean>((resolve, reject)=>{
      observador = this.getUser(cliente.uid).subscribe((data) =>{
        dataUsuario = data;
        console.log("En observable", data);
        resolve(true);
      });  
    });
    if(await promesa == true){
      observador.unsubscribe();
      dataUsuario["aprobado"] = true;
      let bandera = this.actualizarUser(cliente.uid, dataUsuario);
      console.log("Usuario actualizado despues de cambiar su estado: ", bandera);
      return true;
    }
  }

  public getUser(uid: string){
    return this.coleccionUsuarios.doc(uid).valueChanges();
  }

  public actualizarUser(uid: string, data): boolean{
    try{
      this.coleccionUsuarios.doc(uid).update(data);
      return true;
    } catch(error){
      console.log("Error en actualizar usuario", error);
      return false;
    }
  }
}
