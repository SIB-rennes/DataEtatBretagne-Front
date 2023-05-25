import { BopModel } from './bop.models';
import { TOrError } from './t-or-error.model';
import { RefTheme } from './theme.models';

export interface FinancialData {
  themes: RefTheme[];
  bop: BopModel[];
}

export type FinancialDataResolverModel = TOrError<FinancialData>