import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak: Keycloak;

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
  // }
}
