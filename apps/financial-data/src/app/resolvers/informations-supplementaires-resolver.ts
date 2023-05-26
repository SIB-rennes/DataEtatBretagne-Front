import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { InformationsSupplementairesResolverModel } from '@models/informations-supplementiares-resolver.model';
import { catchError, forkJoin, of } from 'rxjs';

export const resolveInformationsSupplementaires: ResolveFn<InformationsSupplementairesResolverModel | Error> =
  (route: ActivatedRouteSnapshot) => {
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
