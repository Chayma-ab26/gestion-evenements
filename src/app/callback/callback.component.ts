// callback.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Component({
  selector: 'app-callback',
  template: `<p>Redirection en cours...</p>`
})
export class CallbackComponent implements OnInit {
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  ngOnInit() {
    // On n'appelle plus init ici
    if (!this.keycloakService.isLoggedIn()) {
      // si pas loggé, on force login
      this.keycloakService.login();
      return;
    }

    // Redirection selon rôle
    const roles = this.keycloakService.getRoles();
    console.log('ROLES KEYCLOAK:', roles);
    alert('Vos rôles Keycloak: ' + JSON.stringify(roles));
    if (roles.includes('admin')) this.router.navigate(['/admin/dashboard-admin']);
    else if (roles.includes('participant')) this.router.navigate(['/participant/participant-dashboard']);
    else if (roles.includes('organisateur')) this.router.navigate(['/organisateur/dashboard-org']);
    else this.router.navigate(['/']);
  }
}
