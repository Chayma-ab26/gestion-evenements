import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { KeycloakService } from './app/services/keycloak.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


  const keycloakService = new KeycloakService();

keycloakService.init()
  .then(() => {
    platformBrowserDynamic([{ provide: KeycloakService, useValue: keycloakService }])
      //.bootstrapModule(AppModule)
      bootstrapApplication(AppComponent, appConfig)
      .catch(err => console.error(err));
  });
