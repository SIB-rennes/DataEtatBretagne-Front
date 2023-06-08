import { TOrError } from 'apps/common-lib/src/lib/models/marqueblanche/t-or-error.model';
import { BopModel } from '../refs/bop.models';
import { RefTheme } from '../refs/theme.models';

export interface FinancialData {
  themes: RefTheme[];
  bop: BopModel[];
}

export type FinancialDataResolverModel = TOrError<FinancialData>
