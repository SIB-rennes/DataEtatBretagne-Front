import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BudgetService } from '@services/budget.service';
import { catchError, of } from 'rxjs';
import { FinancialDataModelV2 } from '@models/financial/financial-data.models';

export const resolveInformationsSupplementaires: ResolveFn<FinancialDataModelV2 | Error> =
  (route: ActivatedRouteSnapshot) => {
    let source = route.params['source'];
    let id = route.params['id'];
    let service = inject(BudgetService);

    return service.getById(source, id).pipe(
      catchError((_error) => {
        return of({
          name: 'Erreur',
          message: 'Erreurs lors de la récupération des données.',
        });
      })
    );
  }
