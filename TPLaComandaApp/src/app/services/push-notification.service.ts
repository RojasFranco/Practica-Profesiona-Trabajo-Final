import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  userIDs = {
    role: '',
    tipo: '',
    usuarioDocID: '',
    userID: ''
  };

  userID: string;

  listUserIDs: string[];

  mensajes: OSNotificationPayload[];

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(
    private oneSignal: OneSignal,
    private ngFireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private http: HttpClient,
  ) { }

  ConfigInitial() {
    this.oneSignal.startInit('7e6f15f5-fb6a-47cc-a09a-4941dab6dc84', '749735220908');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
      // do something when notification is received
      console.log('noti recibido', noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (noti) => {
      // do something when a notification is opened
      console.log('noti abierta', noti);
    });

    // Get userID of subscriber
    this.oneSignal.getIds().then( info => {
      this.userID = info.userId;
      console.log('UserID: ', this.userID);
    });

    this.oneSignal.endInit();
  }

  async notificationRecibido( noti: OSNotification) {
    const payload = noti.payload;
    console.log('payload', payload);
    if ( payload.additionalData !== null ) {
      return;
    }

  }

  async guardarUserID(uid) {
    this.getUsers(uid).subscribe((snap: any) => {
      this.userIDs.userID = this.userID;
      this.userIDs.usuarioDocID = '';
      this.userIDs.role = '';
      this.userIDs.tipo = '';
      const user = snap.payload.data();
      console.log(user);
      this.userIDs.usuarioDocID = uid;
      if (user['role'] === 'supervisor') {
        this.userIDs.role = user['role'];
      }
      if (user['role'] === 'empleado') {
        this.userIDs.role = user['role'];
        this.userIDs.tipo = user['tipo'];
      }
      if (user['role'] === 'cliente') {
        this.userIDs.role = user['role'];
      }
      if (user['role'] === 'cliente_anonimo') {
        this.userIDs.role = user['role'];
      }
      this.AddUserID(this.userID, this.userIDs);
    });
  }

  async AddUserID(docID, data) {
    return new Promise( resolve => {
      this.afs.collection('UserIDs').doc(docID).set(data);
      resolve(true);
    });
  }

  async DeleteUserID(docID) {
    this.userIDs.usuarioDocID = '';
    this.userIDs.role = '';
    this.userIDs.tipo = '';
    this.userIDs.userID = '';
    return new Promise( resolve => {
      this.afs.collection('UserIDs').doc(docID).set(this.userIDs);
      resolve(true);
    });
  }

  getUsers(docID){
    return this.afs.collection('usuarios').doc(docID).snapshotChanges();
  }

  async notificationAbierta() {

  }

  async enviarNotification(message: string) {
    const header = new HttpHeaders().set('Authorization', 'Basic MTY1ZGIxMGUtMmMxNC00YzQyLTkxZjgtMjgxOGE1MTIxYTkz');

    const data = {
      app_id: '7e6f15f5-fb6a-47cc-a09a-4941dab6dc84',
      data: {'userID:': this.userID},
      contents: {en: 'La Comanda', es: 'La Comanda'},
      headings: {en: message, es: message},
      include_player_ids: this.listUserIDs
    };

    return new Promise( resolve =>  {
      this.http.post(
        `https://onesignal.com/api/v1/notifications`,
         data,
         {headers: header, responseType: 'text'})
                      .subscribe( resp => {
                        console.log(resp);
                        if (resp) {
                          resolve(true);
                        } else {
                          resolve(false);
                        }
                      });

    });
  }

  sendUserIDs(message: string, role: string) {
    this.afs.collection('UserIDs').get()
    .subscribe((snap: any) => {
      this.listUserIDs = [];
      snap.forEach(async (data: any) => {
        const userID = data.data();
        const docID = data.id;
        if (userID.role === role) {
          this.listUserIDs.push(docID);
        }
      });
      if (this.listUserIDs.length > 0) {
        this.enviarNotification(message);
      }
    });
  }

  sendUserIDsEmpleado(message: string, tipo: string) {
    this.afs.collection('UserIDs').get()
    .subscribe((snap: any) => {
      this.listUserIDs = [];
      snap.forEach(async (data: any) => {
        const userID = data.data();
        const docID = data.id;
        if (userID.role === 'empleado' && userID.tipo === tipo) {
          this.listUserIDs.push(docID);
        }
      });
      if (this.listUserIDs.length > 0) {
        this.enviarNotification(message);
      }
    });
  }

  sendUserIDsUsuario(message: string, usuarioDocID: string) {
    this.afs.collection('UserIDs').get()
    .subscribe((snap: any) => {
      this.listUserIDs = [];
      snap.forEach(async (data: any) => {
        const userID = data.data();
        const docID = data.id;
        if (userID.usuarioDocID === usuarioDocID) {
          this.listUserIDs.push(docID);
        }
      });
      if (this.listUserIDs.length > 0) {
        this.enviarNotification(message);
      }
    });
  }

}
