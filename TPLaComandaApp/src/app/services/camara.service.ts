import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, FilesystemEncoding,
  CameraPhoto, CameraSource } from '@capacitor/core';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CamaraService {
  public photos: Photo[] = [];
  constructor() { }

  public async AgregarNuevaFoto() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      source: CameraSource.Camera, 
      quality: 100 
    });

    this.photos.unshift({
      filepath: "llenar filePath?...",
      webviewPath: capturedPhoto.webPath,
    });
    return true;
  }
}

export interface Photo {
  filepath: string;
  webviewPath: string;
}
