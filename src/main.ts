
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { KeycloakService } from './app/services/keycloak.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(),
    KeycloakService
  ]
}).then(appRef => {
  const keycloakService = appRef.injector.get(KeycloakService);
  keycloakService.init(); // Angular injecte HttpClient correctement ici
}).catch(err => console.error(err));
