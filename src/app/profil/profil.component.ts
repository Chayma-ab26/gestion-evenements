import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { KeycloakService } from '../services/keycloak.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    if (this.keycloakService.isLoggedIn()) {
      const userId = this.keycloakService.getUserId();
      if (userId) {
        this.userService.getById(userId).subscribe({
          next: (userData: any) => {
            this.user = userData;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching user data:', err);
            this.error = 'Erreur lors du chargement du profil';
            this.loading = false;
          }
        });
      } else {
        this.error = 'ID utilisateur non trouvé';
        this.loading = false;
      }
    } else {
      this.error = 'Utilisateur non connecté';
      this.loading = false;
    }
  }
}
