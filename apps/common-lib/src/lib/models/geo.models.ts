export enum TypeLocalisation {
  DEPARTEMENT = 'Département',
  EPCI = 'Epci',
  COMMUNE = 'Commune',
  CRTE = 'Crte',
}

export interface GeoModel {
  nom: string;
  code: string;
  codeRegion?: string;
  type?: TypeLocalisation;
}

export interface GeoCommuneModel extends GeoModel {
  codesPostaux: string[];
}
