import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to manage authentication
 */
@Injectable({
  providedIn: 'root',
})
export class GeoHttpService {
  private apiGeo = 'https://geo.api.gouv.fr/departements';

  constructor(private http: HttpClient) {}

  public filterDepartement(query: string): Observable<Object[]> {
    console.log('icic');
    return this.http.get<Object[]>(`${this.apiGeo}?nom=${query}`);
  }
}
