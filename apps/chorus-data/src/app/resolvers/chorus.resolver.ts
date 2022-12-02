import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ChorusResolverModel } from '@models/chorus-resolvers.models';
import { ChorusHttpService } from '@services/chorus-http.service';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChorusResolvers implements Resolve<ChorusResolverModel> {
  constructor(private service: ChorusHttpService) {}

  resolve(): Observable<ChorusResolverModel> {
    return forkJoin([this.service.getTheme(), this.service.getBop()]).pipe(
      map((values) => {
        return { themes: values[0], bop: values[1] } as ChorusResolverModel;
      })
    );
  }
}
