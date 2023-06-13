import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FinancialData, FinancialDataResolverModel } from '@models/financial/financial-data-resolvers.models';
import { BudgetService } from '@services/budget.service';
import { map } from 'rxjs/operators';

export const resolveFinancialData: ResolveFn<FinancialDataResolverModel> =
  () => {

    let service = inject(BudgetService);

    return service.getBop().pipe(
      map(bops => {
        const themes = Array.from(new Set(bops.map(bop => bop.label_theme))).sort();
        const result = {themes: themes, bop: bops} as FinancialData;
        return {data: result};
      })
    )
  };
