import { Component } from '@angular/core';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { KeycloakService } from '../../services/keycloak.service';

@Component({
  selector: 'app-header-org',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './header-org.component.html',
  styleUrls: ['./header-org.component.css']
})
export class HeaderOrgComponent {
  isDropdownOpen = false;

  constructor(private router: Router,
    private keycloakService: KeycloakService
  ) {}

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigate(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = false;
  }
  logout() {
    this.keycloakService.logout();
  }
}
