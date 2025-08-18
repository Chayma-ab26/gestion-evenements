import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
 /*  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080/',
      realm: 'EventProject',
      clientId: 'event-app'
    });
  }


  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false
      }).then((authenticated:any) => {
        resolve(authenticated);
      }).catch((err:any) => {
        reject(err);
      });
    });
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.token;
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  // getUsername(): string | undefined {
  //   return this.keycloak.tokenParsed?.preferred_username;
  // } */
   private keycloak: Keycloak | undefined;

  init(): Promise<boolean> {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080/',
      realm: 'EventProject',
      clientId: 'event-app'
    });

    return this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256', // recommandé pour SPA
    }).then(authenticated => {
      console.log('✅ Authenticated:', authenticated);
      return authenticated;
    }).catch(err => {
      console.error('❌ Keycloak init error', err);
      return false;
    });
  }

  getKeycloak() {
    return this.keycloak;
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  logout() {
    this.keycloak?.logout({ redirectUri: 'http://localhost:4200/' });
  }
}
