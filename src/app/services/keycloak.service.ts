

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

  getUserId(): string | undefined {
    return this.keycloak.tokenParsed?.sub;
  }




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

 




​}