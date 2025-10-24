import { Component } from '@angular/core';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { KeycloakService } from '../../services/keycloak.service';


@Component({
  selector: 'app-header-part',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './header-part.component.html',
  styleUrl: './header-part.component.css'
})
export class HeaderPartComponent {
constructor(private router: Router,
    private keycloakService: KeycloakService
  ) {}

   logout() {
    this.keycloakService.logout();
  }
}
