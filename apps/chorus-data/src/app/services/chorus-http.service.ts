import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BopModel } from '@models/bop.models';
import { map, Observable, of } from 'rxjs';
import { ChorusResponse } from '@models/chorus_response.models';
import { SettingsService } from '../../environments/settings.service';

@Injectable({
  providedIn: 'root',
})
export class ChorusHttpService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public filterBop(search: string): Observable<BopModel[]> {
    const apiChorus = this.settings.apiChorus;

    let params = 'limit=5&fields=Id,Label,Code';
    if (search.length <= 3 && !isNaN(Number(search))) {
      params += `&where=(Code,like,${search})`;
    } else {
      params += `&where=(Label,like,${search})`;
    }

    return this.http
      .get<ChorusResponse<BopModel>>(
        `${apiChorus}/RefCodeProgramme/RefCodeProgramme?${params}`
      )
      .pipe(map((response) => response.list));
  }
}
