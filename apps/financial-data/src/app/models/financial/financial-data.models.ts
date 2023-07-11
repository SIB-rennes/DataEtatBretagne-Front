import { Commune, Programme, Siret, SourceFinancialData } from "./common.models";


export const HEADERS_CSV_FINANCIAL = [
  'source',
  'n_ej',
  'poste_ej',
  'montant engagement',
  'montant payé',
  'theme',
  'code programme',
  'programme',
  'code domaine fonctionnel',
  'domaine fonctionnel',
  'referentiel_programmation',
  'commune',
  'siret',
  'nom beneficiaire',
  "type d'établissement",
  'date de dernier paiement',
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
