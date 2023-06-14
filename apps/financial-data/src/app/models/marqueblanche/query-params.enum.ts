import { QueryParam as CommonQueryParam, QueryParam_values as common_values } from "apps/common-lib/src/lib/models/marqueblanche/query-params.enum";

/** Nom des paramètres supportés par financial */
export enum FinancialQueryParam {
    Programmes = 'programmes',

    Niveau_geo = 'niveau_geo',
    Code_geo = 'code_geo',

    Annee_min = 'annee_min',
    Annee_max = 'annee_max',
    
    DomaineFonctionnel = 'domaines_fonctionnels',
    ReferentielsProgrammation = 'referentiels_programmation',
}
const values_FinancialQueryParam = Object.values(FinancialQueryParam);

export type QueryParam = CommonQueryParam | FinancialQueryParam;
export const QueryParam_values = [...common_values, ...values_FinancialQueryParam];