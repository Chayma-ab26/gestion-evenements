import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { KeycloakService } from './app/services/keycloak.service';

const keycloakService = new KeycloakService();

keycloakService.init().then(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      { provide: KeycloakService, useValue: keycloakService } // injecte la même instance partout
    ]
  }).catch(err => console.error(err));
});
