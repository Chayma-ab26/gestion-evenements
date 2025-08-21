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
  private keycloak: Keycloak | undefined;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080/',
      realm: 'EventProject',
      clientId: 'event-app'
    });
  }

  // Init sans redirection automatique
  init(): Promise<boolean> {
  return this.keycloak!.init({
    onLoad: 'check-sso',  // Gardez pour login manuel, mais testez 'login-required' si vous voulez auto-rediriger au load
    checkLoginIframe: true,  // Activez pour mieux gérer SSO via iframe
    pkceMethod: 'S256'
  }).then(authenticated => {
    console.log('Init successful, authenticated:', authenticated);
    return authenticated;
  }).catch(err => {
    console.error('Init error:', err);  // Loggez pour debugger
    return false;  // Retournez false sans throw pour ne pas bloquer l'app
  });
}

 

  login() {
  if (!this.keycloak?.didInitialize) {
    console.warn('Keycloak not initialized, calling init first');
    this.init().then(() => this.keycloak?.login({ redirectUri: window.location.origin + '/dashboard' }));
  } else {
    this.keycloak?.login({ redirectUri: window.location.origin + '/dashboard' });
  }
}
  

  logout() {
    this.keycloak?.logout({ redirectUri: window.location.origin });
  }

  isLoggedIn(): boolean {
    return !!this.keycloak?.token;
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }
getRoles(): string[] {
  const tokenParsed = this.keycloak?.tokenParsed;
  return tokenParsed?.realm_access?.roles || [];
}

  getKeycloak(): Keycloak | undefined {
    return this.keycloak;
  }
}