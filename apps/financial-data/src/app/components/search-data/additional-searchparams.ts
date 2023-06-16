import { Beneficiaire } from "@models/search/beneficiaire.model";

/** Pour les critères de recherche qui n'apparaissent pas dans le formulaire de recherche */
export interface AdditionalSearchParameters {
  domaines_fonctionnels: string[];
  referentiels_programmation: string[];
  sources_region: string[];

  beneficiaires: Beneficiaire[]; // TODO: A mutualiser avec le formulaire de recherche lors de la refonte front
}

export const empty_additional_searchparams: AdditionalSearchParameters = {
  domaines_fonctionnels: [],
  referentiels_programmation: [],
  sources_region: [],

  beneficiaires: [],
}