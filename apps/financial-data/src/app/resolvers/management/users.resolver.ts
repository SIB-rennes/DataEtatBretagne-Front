import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { UsersPagination } from '@models/users/user.models';
import { UserHttpService } from '@services/management/users-http.service';

@Injectable({ providedIn: 'root' })
export class UsersResolver implements Resolve<UsersPagination | Error> {
  constructor(private service: UserHttpService) {}

  resolve(): Observable<UsersPagination | Error> {
    return this.service.getUsers().pipe(
      catchError((error) => {
        return of({
          name: 'Erreur',
          message: 'Erreurs lors de la récupération des données.',
        });
      })
    );
  }
}
