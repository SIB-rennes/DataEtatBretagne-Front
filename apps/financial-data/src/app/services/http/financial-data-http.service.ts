import { Injectable, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BopModel } from '@models/refs/bop.models';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from '../../../environments/settings.service';
import { RefTheme } from '@models/refs/theme.models';
import { FinancialDataModel, FinancialDataModelV2, FinancialPagination } from '@models/financial/financial-data.models';
import { RefSiret } from '@models/refs/RefSiret';
import {
  DataHttpService,
  GeoModel,
  NocodbHttpService,
} from 'apps/common-lib/src/public-api';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import { NocoDbResponse } from 'apps/common-lib/src/lib/models/nocodb-response';
import { DataType } from '@models/audit/audit-update-data.models';

@Injectable({
  providedIn: 'root',
})
export class FinancialDataHttpService extends NocodbHttpService implements DataHttpService<FinancialDataModelV2,FinancialDataModelV2> {
  private _apiFinancialNocoDb!: string;
  private _apiTheme!: string;
  private _apiProgramme!: string;

  private _apiFinancialAe! : string

  constructor(
    private http: HttpClient,
    @Inject(SETTINGS) readonly settings: SettingsService
  ) {
    super();
    const project = this.settings.projectFinancial;
    let base_uri = this.settings.nocodbProxy?.base_uri;
    if (project && base_uri) {
      base_uri += project.table + '/';
      this._apiFinancialNocoDb = base_uri + project.views.financial;
      this._apiProgramme = base_uri + project.views.programmes;
      this._apiTheme = base_uri + project.views.themes;
    }

    this._apiFinancialAe = this.settings.apiFinancialData
  }
  mapToGeneric(object: FinancialDataModelV2): FinancialDataModelV2 {
    return object;
  }

  getById(key: any, ...options: any[]): Observable<FinancialDataModelV2> {
    throw new Error('Method not implemented.');
  }

  public getBop(): Observable<BopModel[]> {
    const params = 'limit=500&fields=Id,Label,Code,RefTheme&sort=Code';
    return this.http
      .get<NocoDbResponse<BopModel>>(`${this._apiProgramme}?${params}`)
      .pipe(map((response) => response.list));
  }

  /**
   * Récupère les themes de Chorus
   * @returns les the
   */
  public getTheme(): Observable<RefTheme[]> {
    return this.http
      .get<NocoDbResponse<RefTheme>>(
        `${this._apiTheme}?fields=Id,Label&sort=Label&limit=500`
      )
      .pipe(map((response) => response.list));
  }


  public get(
    ej: string,
    poste_ej: string | number
  ): Observable<FinancialDataModel | undefined> {
    let params = `&limit=1&where=(NEj,eq,${ej})~and(NPosteEj,eq,${poste_ej})`;
    let answer$ = this.mapNocoDbReponse(
      this.http.get<NocoDbResponse<FinancialDataModel>>(
        `${this._apiFinancialNocoDb}?${params}`
      )
    ).pipe(map((lignes) => lignes[0]));

    return answer$;
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
    year: number[] | null,
    location: GeoModel[] | null,
    bops: BopModel[] | null,
    themes: RefTheme[] | null,
  ): Observable<FinancialDataModelV2[]> {
    if (
      bops == null &&
      themes == null &&
      year == null &&
      location == null &&
      beneficiaire == null
    )
      return of();

    const params = this._buildparams(
      beneficiaire,
      bops,
      themes,
      year,
      location
    );

    return this.http.get<FinancialPagination>(`${this._apiFinancialAe}/ae?${params}`).pipe(
      map( (data: FinancialPagination) => {
        if (!data) {
          return [];
        }
        if (data.pageInfo && data.pageInfo.totalRows > data.pageInfo.pageSize) {
          throw new Error(
            `La limite de lignes de résultat est atteinte. Veuillez affiner vos filtres afin d'obtenir un résultat complet.`
          );
        }
        return data.items
      })
    )
  }


  private _buildparams( beneficiaire: RefSiret | null,
    bops: BopModel[] | null,
    themes: RefTheme[] | null,
    year: number[] | null,
    location: GeoModel[] | null
  ): string {
    let params ='limit=5000';
    if (beneficiaire) {
      params += `&siret_beneficiaire=${beneficiaire.Code}`;
    }
    if (bops) {
      params += `&code_programme=${bops
        .filter((bop) => bop.Code)
        .map((bop) => bop.Code)
        .join(',')}`;
    } else if (themes) {
      params += `&theme=${themes
        .map((theme) => theme.Label)
        .join(',')}`;
    }

    if (location && location.length > 0) {
      const listCode = location.map((l) => l.code).join(',');
      params += `&code_geo=${listCode}`

    }

    if (year && year.length > 0) {
      params += `&annee=${year.join(',')}`;
    }
    return params;
  }

  public loadFinancialFile(
    file: any,
    annee: string,
    type: DataType,
    code_region = '53'
  ): Observable<any> {
    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('annee', annee);
    formData.append('code_region', code_region);

    const apiData = this.settings.apiFinancialData;

    if (type === DataType.FINANCIAL_DATA_AE) {
      return this.http.post(`${apiData}/ae`, formData);
    } else if (type === DataType.FINANCIAL_DATA_CP) {
      return this.http.post(`${apiData}/cp`, formData);
    }
    return of();
  }
}
