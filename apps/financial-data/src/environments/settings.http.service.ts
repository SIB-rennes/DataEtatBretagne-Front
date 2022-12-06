import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Settings } from './settings';
import { KeycloakService } from 'keycloak-angular';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsHttpService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
    private keycloak: KeycloakService
  ) {}

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
      firstValueFrom(this.http.get('assets/settings.json'))
        .then((response) => {
          this.settingsService.settings = response as Settings;
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    }).then(async () => {
      try {
        await this.keycloak.init({
          config: {
            url: this.settingsService.settings.keycloak.url,
            realm: this.settingsService.settings.keycloak.realm,
            clientId: this.settingsService.settings.keycloak.clientId,
          },
          initOptions: {
            checkLoginIframe: false,
          },
          bearerPrefix: 'Bearer',
          enableBearerInterceptor: true,
          bearerExcludedUrls: ['/assets'], // C'est une API publique,
          // Il est nécessaire de les whitelister pour ne pas
          // être redirigé vers la page de login de keycloak
        });
      } catch (error) {
        console.error(error);
      }
    });
  }
}
