import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  constructor(
    private dataBase: AngularFirestore,
    private authService: AuthService
  ) { }


  public subirEncuesta(data){
    let id = this.authService.getUIDUserLoggeado();
    this.dataBase.collection('encuestas').doc(id).set(data);
  }
}
