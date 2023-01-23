export enum TypeLocalisation {
  DEPARTEMENT = 'Département',
  EPCI = 'Epci',
  COMMUNE = 'Commune',
}

export interface GeoModel {
  nom: string;
  code: string;
  codeRegion: String;
  type?: TypeLocalisation;
}

export interface GeoCommuneModel extends GeoModel {
  codesPostaux: string[];
}
