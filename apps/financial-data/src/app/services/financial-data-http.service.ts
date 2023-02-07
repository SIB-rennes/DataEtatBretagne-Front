import { Injectable, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BopModel } from '@models/bop.models';
import { map, Observable, of } from 'rxjs';
import { NocoDbResponse } from '@models/nocodb-response';
import { SettingsService } from '../../environments/settings.service';
import { RefTheme } from '@models/theme.models';
import { FinancialDataModel } from '@models/financial-data.models';
import { RefSiret } from '@models/RefSiret';
import { GeoModel, TypeLocalisation } from 'apps/common-lib/src/public-api';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';

@Injectable({
  providedIn: 'root',
})
export class FinancialDataHttpService {
  constructor(
    private http: HttpClient,
    @Inject(SETTINGS) readonly settings: SettingsService
  ) {}

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

  public filterRefSiret(nomOuSiret: string): Observable<RefSiret[]> {
    const apiFinancial = this.settings.apiFinancial;

    let whereClause = this._filterRefSiretWhereClause(nomOuSiret);

    return this.http
      .get<NocoDbResponse<RefSiret>>(
        `${apiFinancial}/RefSiret/RefSiret?fields=Code,Denomination&sort=Code&${whereClause}`
      )
      .pipe(map((response) => response.list));
  }

  public _filterRefSiretWhereClause(nomOuSiret: string): string {
    let is_number = /^\d+$/.test(nomOuSiret);

    if (is_number) return `where=(Code,like,${nomOuSiret}%)`;
    else return `where=(Denomination,like,${nomOuSiret})`;
  }

  /**
   *
   * @param beneficiaire
   * @param bops
   * @param theme
   * @param year
   * @param location
   * @returns
   */
  public search(
    beneficiaire: RefSiret | null,
    bops: BopModel[] | null,
    themes: RefTheme[] | null,
    year: number[] | null,
    location: GeoModel[] | null
  ): Observable<FinancialDataModel[]> {
    if (bops == null && themes == null && year == null && location == null)
      return of();

    const apiFinancial = this.settings.apiFinancial;

    const params = this._buildparams(
      beneficiaire,
      bops,
      themes,
      year,
      location
    );
    return this.http
      .get<NocoDbResponse<FinancialDataModel>>(
        `${apiFinancial}/DataChorus/Chorus-front?${params}`
      )
      .pipe(map((response) => response.list));
  }

  public getCsv(
    beneficiaire: RefSiret | null,
    bops: BopModel[] | null,
    themes: RefTheme[] | null,
    year: number[] | null,
    location: GeoModel[] | null
  ): Observable<Blob> {
    if (bops == null && themes == null && year == null && location == null)
      return of();

    const apiFinancial = this.settings.apiFinancial;
    const params = this._buildparams(
      beneficiaire,
      bops,
      themes,
      year,
      location
    );
    return this.http.get(
      `${apiFinancial}/DataChorus/Chorus-front/csv?${params}`,
      { responseType: 'blob' }
    );
  }

  private _buildparams(
    beneficiaire: RefSiret | null,
    bops: BopModel[] | null,
    themes: RefTheme[] | null,
    year: number[] | null,
    location: GeoModel[] | null
  ): string {
    let params =
      'sort=code_programme,label_commune&limit=4000&where=(Montant,gt,0)';
    if (beneficiaire) {
      params += `~and(code_siret,eq,${beneficiaire.Code})`;
    }
    if (bops) {
      params += `~and(code_programme,in,${bops
        .filter((bop) => bop.Code)
        .map((bop) => bop.Code)
        .join(',')})`;
    } else if (themes) {
      params += `~and(Theme,in,${themes
        .map((theme) => theme.Label)
        .join(',')})`;
    }

    if (location && location.length > 0) {
      // on est toujours sur le même type

      const listCode = location.map((l) => l.code).join(',');
      switch (location[0].type) {
        case TypeLocalisation.DEPARTEMENT:
          params += `~and(code_departement,in,${listCode})`;
          break;
        case TypeLocalisation.COMMUNE:
          params += `~and(commune,in,${listCode})`;
          break;
        case TypeLocalisation.EPCI:
          params += `~and(code_epci,in,${listCode})`;
          break;
        case TypeLocalisation.CRTE:
          params += `~and(code_crte,in,${listCode})`;
          break;
      }
    }

    if (year && year.length > 0) {
      params += `~and(`;
      year.forEach((value) => {
        params += `~or(DateModificationEj,like,${value})`;
      });
      params += `)`;
    }
    return params;
  }
}
