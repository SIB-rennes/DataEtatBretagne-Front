import { JSONObject } from "apps/preference-users/src/lib/models/preference.models"
import { Theme, ThemeId } from "./theme.model"
import { Bop, BopCode } from "./bop.model"

export type ThemePreFilter = ThemeId | Theme | null
export type BopsPreFilter = Bop | BopCode | null

export interface PreFilters {
  year?: number | number[]

  theme?: ThemePreFilter | ThemePreFilter[]
  bops?: BopsPreFilter | BopsPreFilter[]

  location?: JSONObject[]
  beneficiaire?: JSONObject
}
