import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FinancialDataResolverModel } from '@models/financial-data-resolvers.models';
import { FinancialDataHttpService } from '@services/financial-data-http.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FinancialDataResolver
  implements Resolve<FinancialDataResolverModel>
{
  constructor(private service: FinancialDataHttpService) {}

  resolve(): Observable<FinancialDataResolverModel> {
    return forkJoin({
      themes: this.service.getTheme(),
      bop: this.service.getBop()
    });
  }
}
