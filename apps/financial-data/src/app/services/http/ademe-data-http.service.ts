import { Injectable, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdemeData, mapAdemeToFinancialDataModel } from '@models/ademe.models';
import {
  DataHttpService,
  GeoModel,
  TypeLocalisation,
} from 'apps/common-lib/src/public-api';
import { RefSiret } from '@models/RefSiret';
import { BopModel } from '@models/bop.models';
import { FinancialDataModelV2 } from '@models/financial-data.models';
import { MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR } from '@angular/material/chips';

@Injectable({
  providedIn: 'root',
})
export class AdemeDataHttpService implements DataHttpService {
  // TODO POC

  constructor(private http: HttpClient) {}

  search(
    _beneficiaire: RefSiret | null,
    _year: number[] | null,
    locations: GeoModel[] | null,
    bops: BopModel[] | null
  ): Observable<FinancialDataModelV2[]> {
    if (
      locations?.findIndex(
        (location) =>
          location.type === TypeLocalisation.DEPARTEMENT &&
          location.code === '35'
      ) === -1 ||
      bops?.findIndex((bop) => bop.Code === 'ADEME') === -1
    ) {
      return of([]);
    }

    return this._search().pipe(
      map(ademeData => {
        return ademeData.map(ademe => mapAdemeToFinancialDataModel(ademe));
      })
    )
  }

  private _search(): Observable<AdemeData[]> {

    return this.http.get<AdemeData[]>('./assets/ademe_35.json').pipe(
      map((data) => {
        const tableauObjets = Object.values(data);
        console.log(tableauObjets);
        return tableauObjets;
      })
    );
  }

  getById(key: any, ...options: any[]): Observable<FinancialDataModelV2> {
    throw new Error('Method not implemented.');
  }
}
