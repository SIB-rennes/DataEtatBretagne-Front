import { BopModel } from '../refs/bop.models';
import { TOrError } from '../t-or-error.model';
import { RefTheme } from '../refs/theme.models';

export interface FinancialData {
  themes: RefTheme[];
  bop: BopModel[];
}

export type FinancialDataResolverModel = TOrError<FinancialData>
