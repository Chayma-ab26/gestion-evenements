import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from '../services/keycloak.service';


export const authGuard: CanActivateFn = (route, state) => {
   const keycloakService = inject(KeycloakService);
  const router = inject(Router);
/*
  if (!keycloakService.isLoggedIn()) {
    keycloakService.login(); // redirection vers login Keycloak
    return false;
  } */

  /* const roles = keycloakService.getRoles();
  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.some(r => roles.includes(r))) {
    return true;
  }
 */
  router.navigate(['/notauthorized']);
  return false;
};
