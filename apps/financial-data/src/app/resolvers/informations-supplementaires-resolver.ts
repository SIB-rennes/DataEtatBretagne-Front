import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { InformationsSupplementairesResolverModel } from '@models/informations-supplementiares-resolver.model';
import { catchError, forkJoin, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InformationsSupplementairesResolver
  implements Resolve<InformationsSupplementairesResolverModel | Error>
{
  constructor() {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<InformationsSupplementairesResolverModel | Error> {
    let ej = route.params['ej'];
    let poste_ej = route.params['poste_ej'];

    return forkJoin({
      ej: of(ej),
      poste_ej: of(poste_ej),
    }).pipe(
      catchError((_error) => {
        return of({
          name: 'Erreur',
          message: 'Erreurs lors de la récupération des données.',
        });
      })
    );
  }
}
