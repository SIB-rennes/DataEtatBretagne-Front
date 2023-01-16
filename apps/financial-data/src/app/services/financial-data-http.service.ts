import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BopModel } from '@models/bop.models';
import { map, Observable, of } from 'rxjs';
import { NocoDbResponse } from '@models/nocodb-response';
import { SettingsService } from '../../environments/settings.service';
import { RefTheme } from '@models/theme.models';
import { GeoDepartementModel } from '@models/geo.models';
import { FinancialDataModel } from '@models/financial-data.models';
import { RefSiret } from '@models/RefSiret';

@Injectable({
  providedIn: 'root',
})
export class FinancialDataHttpService {
  constructor(private http: HttpClient, private settings: SettingsService) { }

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
        `${apiFinancial}/RefSiret/RefSiret?fields=Code,Denomination&sort=Label&${whereClause}`
      )
      .pipe(map((response) => response.list))
  }

  public _filterRefSiretWhereClause(nomOuSiret: string): string {

    let is_number = /^\d+$/.test(nomOuSiret)

    if (is_number)
      return `where=(Code,like,${nomOuSiret})`
    else
      return `where=(Denomination,like,${nomOuSiret})`
  }

  /**
   *
   * @param beneficiaire
   * @param bops
   * @param theme
   * @param year
   * @param departement
   * @returns
   */
  public search(
    beneficiaire: RefSiret | null,
    bops: BopModel[] | null,
    theme: RefTheme | null,
    year: number | null,
    departement: GeoDepartementModel | null
  ): Observable<FinancialDataModel[]> {
    if (bops == null && theme == null && year == null && departement == null)
      return of();

    const apiFinancial = this.settings.apiFinancial;

    const params = this._buildparams(beneficiaire, bops, theme, year, departement);
    return this.http
      .get<NocoDbResponse<FinancialDataModel>>(
        `${apiFinancial}/DataChorus/Chorus-front?${params}`
      )
      .pipe(map((response) => response.list));
  }

  public getCsv(
    beneficiaire: RefSiret | null,
    bops: BopModel[] | null,
    theme: RefTheme | null,
    year: number | null,
    departement: GeoDepartementModel | null
  ): Observable<Blob> {
    if (bops == null && theme == null && year == null && departement == null)
      return of();

    const apiFinancial = this.settings.apiFinancial;
    const params = this._buildparams(beneficiaire, bops, theme, year, departement);
    return this.http.get(
      `${apiFinancial}/DataChorus/Chorus-front/csv?${params}`,
      { responseType: 'blob' }
    );
  }

  private _buildparams(
    beneficiaire: RefSiret | null,
    bops: BopModel[] | null,
    theme: RefTheme | null,
    year: number | null,
    departement: GeoDepartementModel | null
  ): string {
    let params =
      'sort=code_programme,Montant,DateModificationEj&limit=4000&where=(Montant,gt,0)';
    if (beneficiaire) {
      params += `~and(code_siret,eq,${beneficiaire.Code})`
    }
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
