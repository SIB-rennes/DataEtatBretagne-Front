import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BopModel } from '@models/bop.models';
import { map, Observable, of } from 'rxjs';
import { ChorusResponse } from '@models/chorus_response.models';
import { SettingsService } from '../../environments/settings.service';
import { RefTheme } from '@models/theme.models';
import { GeoDepartementModel } from '@models/geo.models';
import { ChorusModel } from '@models/chorus.models';

@Injectable({
  providedIn: 'root',
})
export class ChorusHttpService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public getBop(): Observable<BopModel[]> {
    const apiChorus = this.settings.apiChorus;

    const params = 'limit=500&fields=Id,Label,Code,RefTheme';
    return this.http
      .get<ChorusResponse<BopModel>>(
        `${apiChorus}/RefCodeProgramme/RefCodeProgramme?${params}`
      )
      .pipe(map((response) => response.list));
  }

  /**
   * Récupère les themes de Chorus
   * @returns les the
   */
  public getTheme(): Observable<RefTheme[]> {
    const apiChorus = this.settings.apiChorus;

    return this.http
      .get<ChorusResponse<RefTheme>>(
        `${apiChorus}/RefTheme/RefTheme?fields=Id,Label&sort=Label`
      )
      .pipe(map((response) => response.list));
  }

  /**
   *
   * @param bop
   * @param theme
   * @param year
   * @param departement
   * @returns
   */
  public filterChorus(
    bop: BopModel | null,
    theme: RefTheme | null,
    year: number | null,
    departement: GeoDepartementModel | null
  ): Observable<ChorusModel[]> {
    if (bop == null && theme == null && year == null && departement == null)
      return of();
    const apiChorus = this.settings.apiChorus;
    let params = 'where=(Montant,gt,0)';
    if (bop) {
      params += `~and(code_programme,eq,${bop.Code})`;
    } else if (theme) {
      params += `~and(Theme,eq,${theme.Label})`;
    }

    if (departement) {
      params += `~and(code_commune,like,${departement.code}%)`;
    }

    return this.http
      .get<ChorusResponse<ChorusModel>>(
        `${apiChorus}/DataChorus/DataChorus?${params}`
      )
      .pipe(map((response) => response.list));
  }
}
