import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, finalize, Observable, of } from 'rxjs';
import { LoaderService } from '@services/loader.service';
import { UsersPagination } from '@models/users/user.models';
import { UserHttpService } from '@services/management/users-http.service';

@Injectable({ providedIn: 'root' })
export class UsersResolver implements Resolve<UsersPagination | Error> {
  constructor(
    private service: UserHttpService,
    private loading: LoaderService
  ) {}

  resolve(): Observable<UsersPagination | Error> {
    this.loading.startLoader();

    return this.service.getUsers().pipe(
      catchError((error) => {
        console.log(error);
        return of({
          name: 'Erreur',
          message: 'Erreurs lors de la récupération des données.',
        });
      }),
      finalize(() => this.loading.endLoader())
    );
  }
}
