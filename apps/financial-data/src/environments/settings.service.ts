import { Injectable } from '@angular/core';
import { ISettingsService } from 'apps/common-lib/src/lib/environments/interface-settings.service';
import { IApi, Settings, Keycloak } from 'apps/common-lib/src/public-api';

class Api implements IApi {
  financial_data = '';
  nocodb_proxy = '';
  administration = '';
  geo = '';
  referentiel = '';
  apis_externes = '';
}

class FinancialSettings extends Settings {
  help_pdf: string | undefined = undefined;
}

@Injectable({ providedIn: 'root' })
export class SettingsService implements ISettingsService {
  public settings: Settings;

  constructor() {
    this.settings = new FinancialSettings();
    this.settings.apis = new Api();
    this.settings.keycloak = new Keycloak();
  }

  setSettings(settings: Settings): void {
    this.settings = settings;
  }

  getKeycloakSettings(): Keycloak {
    return this.settings.keycloak;
  }

  getSetting(): FinancialSettings {
    return this.settings as FinancialSettings;
  }

  public get apiGeo(): string {
    return (this.settings.apis as Api).geo;
  }

  public get apiReferentiel(): string {
    return (this.settings.apis as Api).referentiel;
  }

  public get apiExternes(): string {
    return (this.settings.apis as Api).apis_externes;
  }

  public get apiNocodb(): string {
    return (this.settings.apis as Api).nocodb_proxy;
  }

  public get apiFinancialData(): string {
    return (this.settings.apis as Api).financial_data;
  }

  public get apiAdministration(): string {
    return (this.settings.apis as Api).administration;
  }
}
