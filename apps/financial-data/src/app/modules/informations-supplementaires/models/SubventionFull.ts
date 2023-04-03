import { RepresentantLegal, Subvention } from "apps/clients/apis-externes";



export interface SubventionFull {
  subvention: Subvention | null;
  contact: RepresentantLegal | null;
}
