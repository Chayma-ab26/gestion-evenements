import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  
  isMenuOpen = false;
  isDropdownOpen = false;
  
  currentUser: any = {
    name: 'Administrateur',
    role: 'ADMIN',
    avatar: 'A'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
    this.closeAllMenus();
  }

  navigateToUsers(): void {
    this.router.navigate(['/users']);
    this.closeAllMenus();
  }

  navigateToEvents(): void {
    this.router.navigate(['/events']);
    this.closeAllMenus();
  }

  navigateToCategories(): void {
    this.router.navigate(['/category']);
    this.closeAllMenus();
  }

  navigateToLocals(): void {
    this.router.navigate(['/local']);
    this.closeAllMenus();
  }

  navigateToSettings(): void {
    this.router.navigate(['/admin/settings']);
    this.closeAllMenus();
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
    this.closeAllMenus();
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.closeAllMenus();
  }

  goToMainSite(): void {
    this.router.navigate(['/']);
    this.closeAllMenus();
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.closeAllMenus();
  }

  private closeAllMenus(): void {
    this.isMenuOpen = false;
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isDropdownOpen) {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu')) {
        this.isDropdownOpen = false;
      }
    }
  }
}