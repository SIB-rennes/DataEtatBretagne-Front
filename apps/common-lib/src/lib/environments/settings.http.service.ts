import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { firstValueFrom } from 'rxjs';
import { Settings } from 'apps/common-lib/src/public-api';
import { ISettingsService } from './interface-settings.service';

export const SETTINGS = new InjectionToken<ISettingsService>('SETTINGS');

@Injectable({ providedIn: 'root' })
export class SettingsHttpService {
  constructor(
    private http: HttpClient,
    @Inject(SETTINGS) private settingsService: ISettingsService,
    private keycloak: KeycloakService
  ) {}

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
      firstValueFrom(this.http.get('assets/settings.json'))
        .then((response) => {
          this.settingsService.setSettings(response as Settings);
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    }).then(async () => {
      try {
        await this.keycloak.init({
          config: {
            url: this.settingsService.getKeycloakSettings().url,
            realm: this.settingsService.getKeycloakSettings().realm,
            clientId: this.settingsService.getKeycloakSettings().clientId,
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
