import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FinancialDataResolverModel } from '@models/financial-data-resolvers.models';
import { FinancialDataHttpService } from '@services/financial-data-http.service';
import { catchError, finalize, forkJoin, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FinancialDataResolver
  implements Resolve<FinancialDataResolverModel | Error>
{
  constructor(private service: FinancialDataHttpService) {}

  resolve(): Observable<FinancialDataResolverModel | Error> {
    return forkJoin({
      themes: this.service.getTheme(),
      bop: this.service.getBop(),
    }).pipe(
      catchError((error) => {
        console.error(error);
        return of({
          name: 'Erreur',
          message: 'Erreurs lors de la récupération des données.',
        });
      })
    );
  }
}
