export class Api {
  url = '';
}
export class Keycloak {
  url = '';
  realm = '';
  clientId = '';
}

export class Settings {
  production = false;
  api: Api = new Api();
  keycloak: Keycloak = new Keycloak();
}
