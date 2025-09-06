/* import { Injectable } from '@angular/core';
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
    this.keycloak?.login();
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
 */
// keycloak.service.ts
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
      clientId: 'event-front'
    });
  }


  // Init sans forcer le login au démarrage
  init(): Promise<void> {
    return this.keycloak.init({
      onLoad: 'check-sso', // ne force pas la redirection
      checkLoginIframe: false,
      pkceMethod: 'S256'
    }).then(authenticated => {
      console.log('Keycloak initialized. Authenticated:', authenticated);
    }).catch(err => {
      console.error('Keycloak init error:', err);
    });
  }

  login() {
    this.keycloak.login({
      redirectUri: window.location.origin + '/callback' // redirige vers /callback après login
    });
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

  getRoles(): string[] {
    if (this.keycloak.authenticated) {
      // Affichage du token pour debug
      console.log('Token ID:', this.keycloak.idTokenParsed);
      console.log('Token Access:', this.keycloak.tokenParsed);
      // Récupération des rôles dans le token d'accès
      if (this.keycloak.tokenParsed && this.keycloak.tokenParsed.realm_access) {
        return this.keycloak.tokenParsed.realm_access.roles;
      }
      // Récupération des rôles dans le token d'ID (parfois utilisé)
      if (this.keycloak.idTokenParsed && this.keycloak.idTokenParsed.realm_access) {
        return this.keycloak.idTokenParsed.realm_access.roles;
      }
    }
    return [];
  }

  getTokenParsed(): any {
    return this.keycloak.tokenParsed;
  }

  getUserId(): string | undefined {
    return this.keycloak.tokenParsed?.sub;
  }
}
