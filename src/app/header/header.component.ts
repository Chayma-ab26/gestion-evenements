import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
    standalone: true,
    imports:[RouterLink]
})
export class HeaderComponent {
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
}
