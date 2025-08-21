import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakService } from './services/keycloak.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    constructor(private keycloakService: KeycloakService) {}

  title = 'projectevent';
  
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
}