import { InfoApiEntreprise } from "apps/clients/apis-externes";
import { ActivitePrincipaleCorrige } from "./correction-api-externes/ActivitePrincipaleCorrige";
import { PersonneMoraleAttributsCorrige } from "./correction-api-externes/PersonneMoraleAttributsCorrige";
import { TrancheEffectifCorrige } from "./correction-api-externes/TrancheEffectifCorrige";



export interface EntrepriseFull extends InfoApiEntreprise {
  quick: {
    personne_morale: PersonneMoraleAttributsCorrige;
    activite_principale: ActivitePrincipaleCorrige;
    tranche_effectif: TrancheEffectifCorrige;
    ess: boolean;
  };
}
