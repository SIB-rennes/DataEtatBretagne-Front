import { JSONObject } from "apps/preference-users/src/lib/models/preference.models"
import { Bop, BopCode } from "./bop.model"

export type ThemePreFilter =  string | null
export type BopsPreFilter = Bop | BopCode | null

export interface PreFilters {
  year?: number | number[]

  theme?: ThemePreFilter | ThemePreFilter[]
  bops?: BopsPreFilter | BopsPreFilter[]

  location?: JSONObject[]
  beneficiaire?: JSONObject
}
