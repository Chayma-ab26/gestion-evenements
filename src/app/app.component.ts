import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { KeycloakService } from './services/keycloak.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
    constructor(private keycloakService: KeycloakService
      , private router: Router
    ) {}

/* async ngOnInit() {
    await this.keycloakService.init(); // Init une seule fois à l’app
  } */
 /* ngOnInit() {
    // Init Keycloak une seule fois, **sans redirectUri**
    this.keycloakService.init()
      .then(authenticated => console.log('Keycloak initialized', authenticated))
      .catch(err => console.error('Keycloak init error', err));

    // Nettoyer hash si erreur login_required
    if (window.location.hash.includes('error=login_required')) {
      window.location.hash = '';
    }
  } */
 /* ngOnInit(): void {
    this.keycloakService.init().then(authenticated => {
      if (authenticated) {
        // Nettoyer hash Keycloak
        if (window.location.hash) window.location.hash = '';

        // Redirection fiable après login
        this.redirectAfterLogin();
      } else {
        this.keycloakService.login();
      }
    });
  }

  redirectAfterLogin() {
    const roles = this.keycloakService.getRoles();

    if (roles.includes('admin')) this.router.navigate(['/admin/dashboard']);
    else if (roles.includes('participant')) this.router.navigate(['/participant/dashboard']);
    else if (roles.includes('organisateur')) this.router.navigate(['/organisateur/dashboard']);
    else this.router.navigate(['/']);
  }


 */
}
