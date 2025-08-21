import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../services/keycloak.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit {

constructor(private keycloakService: KeycloakService, private router: Router) {}
  ngOnInit(): void {
   const roles = this.keycloakService.getRoles();
    if (roles.includes('organisateur')) {
      this.router.navigate(['/organisateur-dashboard']);
    } else if (roles.includes('participant')) {
      this.router.navigate(['/participant-dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
  }


