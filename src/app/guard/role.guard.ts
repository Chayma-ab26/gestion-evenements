import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private keycloak: KeycloakService, private router: Router) {}

  canActivate(route: any): boolean | UrlTree {
    const expectedRoles: string[] = route.data?.roles || [];
    // Récupérer le rôle depuis le localStorage (clé à adapter si besoin)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || '';
    // Si pas d'utilisateur ou pas de rôle, déclenche le login Keycloak
    if (!user || !role) {
      console.log('[RoleGuard] Pas d\'utilisateur ou de rôle, appel login Keycloak');
      this.keycloak.login();
      return false;
    }
    if (expectedRoles.length === 0 || expectedRoles.includes(role)) {
      return true;
    }
    // Redirige vers la home si le rôle ne correspond pas
    return this.router.parseUrl('/');
  }
}
