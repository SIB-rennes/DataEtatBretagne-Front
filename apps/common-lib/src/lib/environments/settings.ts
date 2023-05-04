export interface IApi {}

export class Keycloak {
  url = '';
  realm = '';
  clientId = '';
}

export interface NocodbViews {
  [k: string]: string;
}

export interface TableNocodb<V extends NocodbViews> {
  table: string;
  views: V;
}

export interface NocodbProject<V extends NocodbViews> {
  [k: string]: TableNocodb<V>;
}

export interface NocodApiProxy<
  P extends NocodbProject<V>,
  V extends NocodbViews
> {
  base_uri: string;
  projects: P;
}

export class Settings {
  production = false;
  apis: IApi | undefined = undefined;
  keycloak: Keycloak = new Keycloak();
  contact: string | undefined = undefined;
}
