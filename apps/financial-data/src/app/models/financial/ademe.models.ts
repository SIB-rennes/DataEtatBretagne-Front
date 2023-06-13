import { PageSize } from "apps/common-lib/src/public-api";
import { Commune, Siret } from "./common.models";



export interface AdemeData{
  id: number,
  date_convention: string;
  dates_periode_versement: string;
  montant: number;
  nature: string;
  notification_ue: boolean;
  conditions_versement: string;
  objet: string;
  pourcentage_subvention: number;
  reference_decision: string;
  siret_beneficiaire: Siret;
  commune: Commune
}
