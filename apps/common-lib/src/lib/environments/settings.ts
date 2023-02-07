export interface IApi {}

export class Keycloak {
  url = '';
  realm = '';
  clientId = '';
}

export class Settings {
  production = false;
  apis: IApi | undefined = undefined;
  keycloak: Keycloak = new Keycloak();
}
