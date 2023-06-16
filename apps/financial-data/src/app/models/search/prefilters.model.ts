import { JSONObject } from "apps/preference-users/src/lib/models/preference.models"
import { Bop, BopCode } from "./bop.model"
import { Beneficiaire } from "./beneficiaire.model"

export type ThemePreFilter =  string | null
export type BopsPreFilter = Bop | BopCode | null

export interface PreFilters {
  year?: number | number[]

  theme?: ThemePreFilter | ThemePreFilter[]
  bops?: BopsPreFilter | BopsPreFilter[]

  location?: JSONObject[]
  beneficiaire?: Beneficiaire

  domaines_fonctionnels?: string[]
  referentiels_programmation?: string[]
  sources_region?: string[]

  // TODO: à intégrer comme un paramètre de recherche classique  lors de la refonte frontend
  marqueblanche_beneficiaires?: Beneficiaire[]
}
