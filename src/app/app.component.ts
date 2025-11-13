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


}
