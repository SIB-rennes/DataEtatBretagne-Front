import { Injectable } from '@angular/core';
import { ISettingsService } from 'apps/common-lib/src/lib/environments/interface-settings.service';
import { IApi, Settings, Keycloak } from 'apps/common-lib/src/public-api';

class Api implements IApi {
  franceRelance = '';
  management = '';
}

@Injectable({ providedIn: 'root' })
export class SettingsService implements ISettingsService {
  public settings: Settings;

  constructor() {
    this.settings = new Settings();
    this.settings.apis = new Api();
    this.settings.keycloak = new Keycloak();
  }

  setSettings(settings: Settings): void {
    this.settings = settings;
  }
  getKeycloakSettings(): Keycloak {
    return this.settings.keycloak;
  }

  getSetting(): Settings {
    return this.settings;
  }

  public get apiManagement(): string {
    return (this.settings.apis as Api).management;
  }

  public get apiFranceRelance(): string {
    return (this.settings.apis as Api).franceRelance;
  }
}
