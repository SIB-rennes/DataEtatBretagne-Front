import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BopModel } from '@models/bop.models';
import { map, Observable, of } from 'rxjs';
import { NocoDbResponse } from '@models/nocodb-response';
import { SettingsService } from '../../environments/settings.service';
import { RefTheme } from '@models/theme.models';
import { GeoDepartementModel } from '@models/geo.models';
import { FinancialDataModel } from '@models/financial-data.models';

@Injectable({
  providedIn: 'root',
})
export class FinancialDataHttpService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public getBop(): Observable<BopModel[]> {
    const apiFinancial = this.settings.apiFinancial;

    const params = 'limit=500&fields=Id,Label,Code,RefTheme&sort=Code';
    return this.http
      .get<NocoDbResponse<BopModel>>(
        `${apiFinancial}/RefCodeProgramme/RefCodeProgramme?${params}`
      )
      .pipe(map((response) => response.list));
  }

  /**
   * Récupère les themes de Chorus
   * @returns les the
   */
  public getTheme(): Observable<RefTheme[]> {
    const apiFinancial = this.settings.apiFinancial;

    return this.http
      .get<NocoDbResponse<RefTheme>>(
        `${apiFinancial}/RefTheme/RefTheme?fields=Id,Label&sort=Label`
      )
      .pipe(map((response) => response.list));
  }

  /**
   *
   * @param bops
   * @param theme
   * @param year
   * @param departement
   * @returns
   */
  public search(
    bops: BopModel[] | null,
    theme: RefTheme | null,
    year: number | null,
    departement: GeoDepartementModel | null
  ): Observable<FinancialDataModel[]> {
    if (bops == null && theme == null && year == null && departement == null)
      return of();

    const apiFinancial = this.settings.apiFinancial;

    const params = this._buildparams(bops, theme, year, departement);
    return this.http
      .get<NocoDbResponse<FinancialDataModel>>(
        `${apiFinancial}/DataChorus/Chorus-front?${params}`
      )
      .pipe(map((response) => response.list));
  }

  public getCsv(
    bops: BopModel[] | null,
    theme: RefTheme | null,
    year: number | null,
    departement: GeoDepartementModel | null
  ): Observable<Blob> {
    if (bops == null && theme == null && year == null && departement == null)
      return of();

    const apiFinancial = this.settings.apiFinancial;
    const params = this._buildparams(bops, theme, year, departement);
    return this.http.get(
      `${apiFinancial}/DataChorus/Chorus-front/csv?${params}`,
      { responseType: 'blob' }
    );
  }

  private _buildparams(
    bops: BopModel[] | null,
    theme: RefTheme | null,
    year: number | null,
    departement: GeoDepartementModel | null
  ): string {
    let params =
      'sort=code_programme,Montant,DateModificationEj&limit=4000&where=(Montant,gt,0)';
    if (bops) {
      params += `~and(code_programme,in,${bops
        .filter((bop) => bop.Code)
        .map((bop) => bop.Code)
        .join(',')})`;
    } else if (theme) {
      params += `~and(Theme,eq,${theme.Label})`;
    }

    if (departement) {
      params += `~and(code_departement,eq,${departement.code})`;
    }

    if (year) {
      params += `~and(DateModificationEj,like,${year})`;
    }
    return params;
  }
}
