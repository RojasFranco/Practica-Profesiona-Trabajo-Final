import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CloudFirestoreService {

  constructor(private db: AngularFirestore, private firestorage: AngularFireStorage) { }

  AgregarConId(coleccion: string, id: string, elementoAgregar){
    return this.db.collection(coleccion).doc(id).set(elementoAgregar);
  }

  AgregarSinId(coleccion: string, elementoAgregar){
    return this.db.collection(coleccion).add(elementoAgregar);
  }

  Actualizar(coleccion: string, id: string, camposActualizados){
    return this.db.collection(coleccion).doc(id).update(camposActualizados);
  }

  Borrar(coleccion: string, id: string){
    return this.db.collection(coleccion).doc(id).delete();
  }

  ObtenerTodosTiempoReal(coleccion: string){
    return this.db.collection(coleccion).snapshotChanges();
  }

  ObtenerTodos(coleccion: string){
    return this.db.collection(coleccion).get();
  }

  ObtenerUno(coleccion: string, id: string){
    return this.db.collection(coleccion).doc(id).get();
  }


  /* Retorna Url de imagen */
  async AgregarImagen(file){
    let urlretorno: string;
    const path = 'imagenes/' + Date.now() + Math.random() * 10;

    // REFERENCIA
    const referencia = firebase.storage().ref(path);
    // SUBO
    await referencia.put(file).then(async () => {
      // Guardo url
      await referencia.getDownloadURL().then(rta => {
      urlretorno = rta;
      });
    });

    return urlretorno;
  }
}
