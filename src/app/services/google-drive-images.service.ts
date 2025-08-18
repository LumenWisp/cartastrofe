import { Injectable } from '@angular/core';
import { loadGapiInsideDOM, gapi } from 'gapi-script';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveImagesService {
  private CLIENT_ID = 'SEU_CLIENT_ID.apps.googleusercontent.com'; // FALTA COLOCAR
  private API_KEY = 'SUA_API_KEY'; //FALTA COLOCAR
  private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  private SCOPES = 'https://www.googleapis.com/auth/drive.file'; // ou drive.readonly, etc.  

  constructor() { }

  async init() {
    await loadGapiInsideDOM();
    gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES,
    });
  }

  async signIn() {
    await this.init();
    return gapi.auth2.getAuthInstance().signIn();
  }

  // bito: quando eu colocar o cartão no negócio do google drive eu implemento essa função junto
  async uploadFiles(){

  }
}
