import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (!keycloakService.isLoggedIn()) {
    keycloakService.login();
    return false;
  }

  const roles = keycloakService.getRoles();
  // Redirection basée sur le rôle (ex. : premier rôle trouvé)
  if (roles.includes('organisateur')) {
    router.navigate(['/dashboard-org']);
    return false;  // Bloque l'accès à la route actuelle si redirection
  } else if (roles.includes('participant')) {
    router.navigate(['/participant-dashboard']);
    return false;
  } else {
    // Rôle par défaut ou erreur
    router.navigate(['/default-dashboard']);
    return false;
  }
};
