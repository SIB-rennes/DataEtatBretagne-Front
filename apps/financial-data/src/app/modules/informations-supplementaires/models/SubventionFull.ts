import { RepresentantLegal, Subvention } from "apps/clients/apis-externes";



export interface SubventionFull {
  siret: string;
  subvention: Subvention | null;
  contact: RepresentantLegal | null;
}
