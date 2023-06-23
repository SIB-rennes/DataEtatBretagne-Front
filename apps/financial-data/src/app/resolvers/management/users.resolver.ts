import { inject, Injectable } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { UsersPagination } from 'apps/management/src/lib/models/users/user.models';
import { UserHttpService } from 'apps/management/src/lib/services/users-http.service';
import { catchError, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersResolver  {
  constructor(private service: UserHttpService) {}

  resolve(): Observable<UsersPagination | Error> {
    return this.service.getUsers().pipe(
      catchError((_error) => {
        return of({
          name: 'Erreur',
          message: 'Erreurs lors de la récupération des données.',
        });
      })
    );
  }
}

export const resolveUsers: ResolveFn<UsersPagination | Error> = () => {
  const resolver = inject(UsersResolver)
  return resolver.resolve()
}