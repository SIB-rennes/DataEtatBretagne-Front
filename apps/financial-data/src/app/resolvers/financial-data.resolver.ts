import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FinancialDataResolverModel } from '@models/financial-data-resolvers.models';
import { FinancialDataHttpService } from '@services/financial-data-http.service';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FinancialDataResolver
  implements Resolve<FinancialDataResolverModel>
{
  constructor(private service: FinancialDataHttpService) {}

  resolve(): Observable<FinancialDataResolverModel> {
    return forkJoin([this.service.getTheme(), this.service.getBop()]).pipe(
      map((values) => {
        return {
          themes: values[0],
          bop: values[1],
        } as FinancialDataResolverModel;
      })
    );
  }
}
