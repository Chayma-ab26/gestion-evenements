
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

 import { Injectable, NgZone } from '@angular/core';
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

  constructor(private http: HttpClient, private router: Router,
    private ngZone: NgZone
    
  ) {}

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

 // keycloak.service.ts
getUsername(): string | null {
  const profile = this.keycloak?.profile;
  if (profile) {
    return profile.username ?? profile.email ?? profile.firstName ?? null;
  }
  return null;
}




/* private redirectByRole(): void {
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
 */
// Exemple dans ton keycloak.service.ts
//////

async getCurrentUser(): Promise<any> {
  const token = this.getToken();
  if (!token) {
    throw new Error('Token non trouvé — utilisateur non connecté');
  }

  return fetch('http://localhost:8070/users/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    return response.json();
  });
}
///////

private redirectByRole(): void {
  if (!this.keycloak.token) return;

  this.http.get<any>('/api/users/me', {
    headers: { Authorization: `Bearer ${this.keycloak.token}` }
  }).subscribe({
    next: user => {
      const role = user.role;

      switch (role) {
        case 'admin':
         this.ngZone.run(() => this.router.navigate(['/dashboard-admin']));
          break;
        case 'organisateur':
          this.ngZone.run(() => this.router.navigate(['/dashboard-org']));
          break;
        case 'participant':
          this.ngZone.run(() => this.router.navigate(['/participant-dashboard']));
          break;
        default:
          this.ngZone.run(() => this.router.navigate(['/not-authorized']));
          break;
      }
    },
    error: err => {
      console.error('Erreur récupération rôle:', err);
      this.ngZone.run(() => this.router.navigate(['/not-authorized']));
    }
  });

  
}

 



/* import { Injectable, NgZone } from '@angular/core';
import Keycloak from 'keycloak-js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'chaima-event-realm',
    clientId: 'event-front',
  });

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { }

  async init(): Promise<void> {
    await this.keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false });

    if (this.keycloak.authenticated) {
      this.redirectByRole();
    }
  }

  login() {
    this.keycloak.login({ redirectUri: window.location.origin });
  }

  register() {
    this.keycloak.login({
      redirectUri: window.location.origin,
      action: 'register'
    });
  }

  logout() {
    this.clearKeycloakState();
    localStorage.clear();
    sessionStorage.clear();
    
    this.keycloak.logout({
      redirectUri: window.location.origin
    }).catch(error => {
      console.error('Logout error:', error);
      window.location.href = window.location.origin;
    });
  }

  isLoggedIn(): boolean {
    return !!(this.keycloak.authenticated && this.keycloak.token);
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  getTokenParsed(): any {
    return this.keycloak.tokenParsed;
  }

  getUserId(): string | undefined {
    return this.keycloak.tokenParsed?.sub;
  }

  getRoles(): string[] {
    if (this.keycloak.authenticated) {
      if (this.keycloak.tokenParsed?.realm_access) {
        return this.keycloak.tokenParsed.realm_access.roles;
      }
      if (this.keycloak.idTokenParsed?.realm_access) {
        return this.keycloak.idTokenParsed.realm_access.roles;
      }
    }
    return [];
  }

  clearKeycloakState(): void {
    try {
      this.keycloak.clearToken();
    } catch (error) {
      console.error('Error clearing Keycloak state:', error);
    }
  }

  private redirectByRole(): void {
    if (!this.keycloak.token) return;
    
    const tokenParsed = this.keycloak.tokenParsed;
    const roles = tokenParsed?.realm_access?.roles || [];
    const role = roles.length > 0 ? roles[0] : null;

    this.ngZone.run(() => {
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
    });
  }
} */
​}