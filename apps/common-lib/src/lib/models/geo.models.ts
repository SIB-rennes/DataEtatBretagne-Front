export enum TypeLocalisation {
  DEPARTEMENT = 'Département',
  EPCI = 'Epci',
  COMMUNE = 'Commune',
  CRTE = 'Crte',
  ARRONDISSEMENT = 'Arrondissement',
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

export interface GeoArrondissementModel extends Omit<GeoModel, 'nom'> {
  label: string;
  code_departement: string;
  code_region: string;
}
