import { Api, Settings, Keycloak } from './settings';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  public settings: Settings;

  constructor() {
    this.settings = new Settings();
    this.settings.api = new Api();
    this.settings.keycloak = new Keycloak();
  }
}
