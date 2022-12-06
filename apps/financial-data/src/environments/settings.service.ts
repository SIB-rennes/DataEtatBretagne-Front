import { Api, Settings, Keycloak } from './settings';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  public settings: Settings;

  constructor() {
    this.settings = new Settings();
    this.settings.apis = new Api();
    this.settings.keycloak = new Keycloak();
  }

  public get apiGeo(): string {
    return this.settings.apis.geo;
  }

  public get apiFinancial(): string {
    return this.settings.apis.financial;
  }
}
