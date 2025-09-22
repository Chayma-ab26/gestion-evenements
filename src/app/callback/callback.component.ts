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

  ngOnInit(): void {
    // Vérifier login
    /* if (!this.keycloakService.isLoggedIn()) {
      this.keycloakService.login();
      return;
    } */

/*     const roles = this.keycloakService.getRoles();

    if (roles.includes('admin')) this.router.navigate(['/admin/dashboard-admin']);
    else if (roles.includes('organisateur')) this.router.navigate(['/organisateur/dashboard-org']);
    else if (roles.includes('participant')) this.router.navigate(['/participant/participant-dashboard']);
    else this.router.navigate(['/']);
  }
}
*/

/*
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

ngOnInit(): void {
  this.keycloakService.getCurrentUser()
    .then(user => {
      console.log("Utilisateur local:", user);

      switch (user.role) {
        case 'admin':
          this.router.navigate(['/admin/dashboard']);
          break;
        case 'organisateur':
          this.router.navigate(['/organisateur/dashboard-o']);
          break;
        case 'consultant':
          this.router.navigate(['/consultant/dashboard']);
          break;
        default:
          this.router.navigate(['/unauthorized']);
      }
    })
    .catch(err => {
      console.error("Erreur récupération utilisateur local:", err);
      this.router.navigate(['/login']);
    });
} */


  }}
