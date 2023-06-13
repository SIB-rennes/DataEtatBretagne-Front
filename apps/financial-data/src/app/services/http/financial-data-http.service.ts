import { Injectable, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BopModel } from '@models/refs/bop.models';
import { Observable, of } from 'rxjs';
import { SettingsService } from '../../../environments/settings.service';
import { FinancialDataModel } from '@models/financial/financial-data.models';
import { RefSiret } from '@models/refs/RefSiret';
import {
  DataHttpService,
  GeoModel,
} from 'apps/common-lib/src/public-api';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import { DataType } from '@models/audit/audit-update-data.models';
import { SourceFinancialData } from '@models/financial/common.models';
import { DataPagination } from 'apps/common-lib/src/lib/models/pagination/pagination.models';

@Injectable({
  providedIn: 'root',
})
export class FinancialDataHttpService  implements DataHttpService<FinancialDataModel,FinancialDataModel> {
  private _apiFinancialAe! : string

  constructor(
    private http: HttpClient,
    @Inject(SETTINGS) readonly settings: SettingsService
  ) {
    this._apiFinancialAe = this.settings.apiFinancialData
  }
  mapToGeneric(object: FinancialDataModel): FinancialDataModel {
    return {...object, source: SourceFinancialData.CHORUS};
  }

  getSource(): string {
    return SourceFinancialData.CHORUS;
  }

  public getById(id: number): Observable<FinancialDataModel> {
    return this.http.get<FinancialDataModel>(`${this._apiFinancialAe}/ae/${id}`);
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
    themes: string[] | null,
  ): Observable<DataPagination<FinancialDataModel>> {
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

    return this.http.get<DataPagination<FinancialDataModel>>(`${this._apiFinancialAe}/ae?${params}`);
  }


  private _buildparams( beneficiaire: RefSiret | null,
    bops: BopModel[] | null,
    themes: string[] | null,
    year: number[] | null,
    location: GeoModel[] | null
  ): string {
    let params ='limit=5000';
    if (beneficiaire) {
      params += `&siret_beneficiaire=${beneficiaire.siret}`;
    }
    if (bops) {
      params += `&code_programme=${bops
        .filter((bop) => bop.code)
        .map((bop) => bop.code)
        .join(',')}`;
    } else if (themes) {
      params += `&theme=${themes.join(',')}`;
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
