import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Concepto } from '../models/concepto-model';

@Injectable({
  providedIn: 'root'
})
export class ConceptosService {

  conceptos: Concepto[] = [];
  concepto: Concepto;

  tempImages: string[] = [];

  arrayIndex: Array<any> = [];


  constructor(private afs: AngularFirestore) { }

  getConceptos() {
    return this.afs.collection('conceptos').snapshotChanges();
  }

  getConcepto(id) {
    return this.afs.collection('conceptos').doc(id).snapshotChanges();
  }

  createConcepto( concepto ) {

    return new Promise( resolve => {
        this.afs.collection('conceptos').add(concepto);
        resolve(true);
    });
  }

  updateConcepto(documentId: string, data: any) {
    return new Promise( resolve => {
      this.afs.collection('conceptos').doc(documentId).set(data);
      resolve(true);
    });
  }


}
