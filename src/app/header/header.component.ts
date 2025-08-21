import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
    standalone: true,
    imports:[RouterLink]
})
export class HeaderComponent {
    constructor(private keycloakService: KeycloakService) {}

 isDropdownOpen = false;

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigate(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen = false;
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
login(event: Event) {
  event.preventDefault();
  this.keycloakService.login();
}



  logout() {
    this.keycloakService.logout();
  }
}
