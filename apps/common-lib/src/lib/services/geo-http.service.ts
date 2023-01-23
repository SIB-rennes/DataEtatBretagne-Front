import { Inject, Injectable, InjectionToken, Type } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  GeoCommuneModel,
  GeoModel,
  TypeLocalisation,
} from '../models/geo.models';
export const API_GEO_PATH = new InjectionToken<string>('API GEO');

@Injectable({
  providedIn: 'root',
})
export class GeoHttpService {
  constructor(
    private http: HttpClient,
    @Inject(API_GEO_PATH) private readonly apiGeo: string
  ) {}

  public filterDepartement(search: string): Observable<GeoModel[]> {
    let params = 'limit=5';
    if (search.length <= 2 && !isNaN(Number(search.substring(0, 1)))) {
      params += `&code=${search}`;
    } else {
      params += `&nom=${search}`;
    }
    return this.http
      .get<GeoModel[]>(`${this.apiGeo}/departements?${params}`)
      .pipe(
        map((arrayGeo: GeoModel[]) => {
          return arrayGeo.map((geo: GeoModel) => {
            return { ...geo, type: TypeLocalisation.DEPARTEMENT };
          });
        })
      );
  }

  public filterEpci(search: string): Observable<GeoModel[]> {
    let params = 'limit=5';
    if (search.length <= 8 && !isNaN(Number(search.substring(0, 7)))) {
      params += `&code=${search}`;
    } else {
      params += `&nom=${search}`;
    }
    return this.http.get<GeoModel[]>(`${this.apiGeo}/epcis?${params}`).pipe(
      map((arrayGeo: GeoModel[]) => {
        return arrayGeo.map((geo: GeoModel) => {
          return { ...geo, type: TypeLocalisation.EPCI };
        });
      })
    );
  }

  public filterCommune(search: string): Observable<GeoCommuneModel[]> {
    let params = 'limit=5';
    if (search.length <= 5 && !isNaN(Number(search.substring(0, 4)))) {
      params += `&codePostal=${search}`;
    } else {
      params += `&nom=${search}`;
    }
    return this.http
      .get<GeoCommuneModel[]>(
        `${this.apiGeo}/communes?${params}&fields=code,nom,codesPostaux`
      )
      .pipe(
        map((arrayGeo: GeoCommuneModel[]) => {
          return arrayGeo.map((geo: GeoCommuneModel) => {
            return { ...geo, type: TypeLocalisation.COMMUNE };
          });
        })
      );
  }
}
