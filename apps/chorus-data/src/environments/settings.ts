export class Api {
  chorus = '';
  geo = '';
}
export class Keycloak {
  url = '';
  realm = '';
  clientId = '';
}

export class Settings {
  production = false;
  apis: Api = new Api();
  keycloak: Keycloak = new Keycloak();
}
