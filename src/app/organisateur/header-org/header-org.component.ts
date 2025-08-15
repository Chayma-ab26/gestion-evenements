import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header-org',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header-org.component.html',
  styleUrls: ['./header-org.component.css']
})
export class HeaderOrgComponent {
  isDropdownOpen = false;

  constructor(private router: Router) {}

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigate(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = false;
  }
}
