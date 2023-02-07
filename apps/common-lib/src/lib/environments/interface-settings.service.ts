import { Keycloak, Settings } from 'apps/common-lib/src/public-api';

export interface ISettingsService {
  setSettings(arg0: Settings): void;
  getSetting(): Settings;

  getKeycloakSettings(): Keycloak;
}
