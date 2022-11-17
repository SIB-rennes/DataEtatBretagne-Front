import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingsService } from '../../environments/settings.service';
import { GeoDepartementModel } from '@models/geo.models';

/**
 * Service to manage authentication
 */
@Injectable({
  providedIn: 'root',
})
export class GeoHttpService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public filterDepartement(search: string): Observable<GeoDepartementModel[]> {
    const apiGeo = this.settings.apiGeo;

    let params = 'limit=5';
    if (search.length <= 2 && !isNaN(Number(search.substring(0, 1)))) {
      params += `&code=${search}`;
    } else {
      params += `&nom=${search}`;
    }

    return this.http.get<GeoDepartementModel[]>(`${apiGeo}?${params}`);
  }
}
