import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private keycloak: KeycloakService, private router: Router) {}

  canActivate(route: any): boolean | UrlTree {
   /*  const roles = this.keycloak.getRoles();
    const expectedRoles: string[] = route.data?.roles || [];
    if (expectedRoles.length === 0 || expectedRoles.some(r => roles.includes(r))) {
      return true;
    }
    // Redirige vers la home si le rôle ne correspond pas
    */
    return this.router.parseUrl('/');
  }
}
