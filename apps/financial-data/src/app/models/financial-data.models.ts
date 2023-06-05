import { PageSize } from "apps/common-lib/src/lib/models/pagination/pagesize.models";

export interface FinancialDataModel {
  NEj: string;
  NPosteEj: number;

  DateModificationEj: Date;

  Montant: number;

  code_programme: string;
  nom_programme: string;
  Theme: string;
  code_siret: string;
  nom_beneficiaire: string;
  type_etablissement: string;

  code_commune: string;
  code_departement: string;
  code_ref_programmation: string;
  Annee: number;
}


export interface FinancialPagination {
  items: FinancialDataModelV2[];
  pageInfo?: PageSize;
}

export interface FinancialDataModelV2 {
  montant_ae: number;
  montant_cp: number;
  commune: Commune;

  domaine_fonctionnel?: any;
  programme: any;
  referentiel_programmation: any

  n_ej: string;
  n_poste_ej: number;

  annee: number;

  siret: Siret;
  date_cp: string;
}


export interface Siret {
  code: string;
  nom_beneficiare: string
}

export interface Commune {
  label: string;
  code: string;
}
