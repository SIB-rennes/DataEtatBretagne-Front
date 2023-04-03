import { InfoApiEntreprise } from "apps/clients/apis-externes";



export interface EntrepriseFull extends InfoApiEntreprise {
  quick: {
    personne_morale: PersonneMoraleAttributsCorrige;
    activite_principale: ActivitePrincipaleCorrige;
    tranche_effectif: TrancheEffectifCorrige;
    ess: boolean;
  };
}
