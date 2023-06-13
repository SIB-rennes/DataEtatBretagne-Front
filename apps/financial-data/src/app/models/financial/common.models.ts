export interface Programme {
  code?: string;
  label: string;
  theme: string;
}

export interface Siret {
  code: string;
  nom_beneficiare: string,
  categorie_juridique?: string
}

export interface Commune {
  label: string;
  code: string;
}

export enum SourceFinancialData {
  ADEME = 'ADEME',
  CHORUS = 'CHORUS'
}
