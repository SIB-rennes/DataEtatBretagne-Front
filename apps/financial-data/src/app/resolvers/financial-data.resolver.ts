import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FinancialDataResolverModel } from '@models/financial-data-resolvers.models';
import { FinancialDataHttpService } from '@services/financial-data-http.service';
import { catchError, forkJoin, of } from 'rxjs';

export const resolveFinancialData: ResolveFn<FinancialDataResolverModel | Error> =
    () => {

      let service = inject(FinancialDataHttpService);

      return forkJoin({
        themes: service.getTheme(),
        bop: service.getBop(),
      }).pipe(
        catchError((_error) => {
          return of({
            name: 'Erreur',
            message: 'Erreurs lors de la récupération des données.',
          });
        })
      );
    };
