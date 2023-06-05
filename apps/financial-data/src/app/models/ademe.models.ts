import { FinancialDataModelV2 } from "./financial-data.models";

export interface AdemeData {

  nom_attribuant: string;
  id_attribuant: string;
  date_convention: string;
  reference_decision: string;
  nom_beneficiaire: string;
  siret: string;
  objet: string;
  montant: number;
  nature: string;
  conditions_versement: string;
  dates_periode_versement: string;
  notification_ue: boolean;
  pourcentage_subvention: number;
  departement: number;
  naf1etlib: string;
  naf2etlib : string;
  naf3etlib: string
  naf4etlib: string;
  naf5etlib: string;
}



export function mapAdemeToFinancialDataModel(ademe: AdemeData): FinancialDataModelV2  {

const date_versement = ademe.dates_periode_versement.split("_")

  return {
    montant_ae: ademe.montant,
    montant_cp:  ademe.montant,
    commune: {label: 'Departement 35', code : "35"},
    programme: {label : 'ADEME', code: 'ADEME'},
    referentiel_programmation: {
      label: ademe.objet,
      code : ''
    },

    n_ej: ademe.reference_decision,
    n_poste_ej: 0,

    annee: Number(ademe.date_convention.substring(0,4)),

    siret: {code: ademe.siret, nom_beneficiare: ademe.nom_beneficiaire},

    date_cp: date_versement[date_versement.length - 1]
  }

};
