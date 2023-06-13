import { TOrError } from 'apps/common-lib/src/lib/models/marqueblanche/t-or-error.model';
import { BopModel } from '../refs/bop.models';

export interface FinancialData {
  themes: string[];
  bop: BopModel[];
}

export type FinancialDataResolverModel = TOrError<FinancialData>
