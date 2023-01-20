import { Inject, Injectable, InjectionToken } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeoDepartementModel } from '../models/geo.models';
export const API_GEO_PATH = new InjectionToken<string>('API GEO');

@Injectable({
  providedIn: 'root',
})
export class GeoHttpService {
  constructor(
    private http: HttpClient,
    @Inject(API_GEO_PATH) private readonly apiGeo: string
  ) {}

  public filterDepartement(search: string): Observable<GeoDepartementModel[]> {
    let params = 'limit=5';
    if (search.length <= 2 && !isNaN(Number(search.substring(0, 1)))) {
      params += `&code=${search}`;
    } else {
      params += `&nom=${search}`;
    }

    return this.http.get<GeoDepartementModel[]>(`${this.apiGeo}?${params}`);
  }
}
