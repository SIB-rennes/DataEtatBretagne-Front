import { PageSize } from "apps/common-lib/src/lib/models/pagination/pagesize.models";


export enum SourceFinancialData {
  ADEME = 'ADEME',
  CHORUS = 'CHORUS'
}


export interface FinancialPagination {
  items:  FinancialDataModel[];
  pageInfo?: PageSize;
}


export const HEADERS_CSV_FINANCIAL = [
  'n_ej',
  'poste_ej',
  'montant engagement',
  'montant payé',
  'theme',
  'code programme',
  'programme',
  'referentiel_programmation',
  'commune',
  'siret',
  'nom beneficiaire',
  "type d'établissement",
  'dater dernier paiement',
  'année engagement',
];

export interface FinancialDataModel {

  id: number;
  source: SourceFinancialData;

  n_ej: string;
  n_poste_ej: number;

  montant_ae: number;
  montant_cp: number;
  commune: Commune;

  domaine_fonctionnel?: any;
  programme: Programme;
  referentiel_programmation: any

  annee: number;

  siret: Siret;
  date_cp: string;
}

export interface Programme {
  code: string;
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
