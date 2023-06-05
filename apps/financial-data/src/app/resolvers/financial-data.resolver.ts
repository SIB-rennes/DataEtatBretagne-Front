import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FinancialDataResolverModel } from '@models/financial-data-resolvers.models';
import { FinancialDataHttpService } from '@services/http/financial-data-http.service';
import { catchError, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

export const resolveFinancialData: ResolveFn<FinancialDataResolverModel> =
  () => {

    let service = inject(FinancialDataHttpService);

    return forkJoin({
      themes: service.getTheme(),
      bop: service.getBop(),
    }).pipe(
      map(data => {
        return { data }
      }),
      catchError((_error) => {
        return of(
          {
            error: new Error("Erreur lors de la récupération des données")
          }
        );
      })
    );
  };
