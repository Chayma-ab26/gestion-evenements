
// keycloak.service.ts
/* import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Observable } from 'rxjs';

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

  init(): Promise<void> {
    return this.keycloak.init({
      onLoad: 'check-sso',
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
      redirectUri: window.location.origin + '/callback'
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
      console.log('Token ID:', this.keycloak.idTokenParsed);
      console.log('Token Access:', this.keycloak.tokenParsed);

      if (this.keycloak.tokenParsed?.realm_access) {
        return this.keycloak.tokenParsed.realm_access.roles;
      }

      if (this.keycloak.idTokenParsed?.realm_access) {
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

 */
/*  getCurrentUser(): Promise<any> {
  const token = this.getToken();
  return fetch('//users/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
}
 */

 import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'EventProject',
    clientId: 'event-front',
  });

  constructor(private http: HttpClient, private router: Router) {}

 async init(): Promise<void> {
  await this.keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false });

  if (this.keycloak.authenticated) {
    this.redirectByRole();
  }
}
  login() {
    this.keycloak.login({ redirectUri: window.location.origin });
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

 
private redirectByRole(): void {
  if (!this.keycloak.token) return;

  this.http.get<any>('api/users/me', {
    headers: { Authorization: `Bearer ${this.keycloak.token}` }
  }).subscribe({
    next: user => {
      const role = user.role;

      // Utilisation du router Angular uniquement
      switch (role) {
        case 'admin':
          this.router.navigate(['/dashboard-admin']);
          break;
        case 'organisateur':
          this.router.navigate(['/dashboard-org']);
          break;
        case 'participant':
          this.router.navigate(['/participant-dashboard']);
          break;
        default:
          this.router.navigate(['/not-authorized']);
          break;
      }
    },
    error: err => {
      console.error('Erreur récupération rôle:', err);
      this.router.navigate(['/not-authorized']);
    }
  });
}

}

