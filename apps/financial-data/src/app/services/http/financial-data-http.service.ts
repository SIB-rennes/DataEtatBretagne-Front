import { Injectable, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SettingsService } from '../../../environments/settings.service';
import { FinancialDataModel } from '@models/financial/financial-data.models';
import {
  DataHttpService,
  SearchParameters,
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
   * @param SearchParameters
   * @returns
   */
  public search(search_params: SearchParameters): Observable<DataPagination<FinancialDataModel>> {
    if (
      search_params?.bops == null &&
      search_params?.themes == null &&
      search_params?.years == null &&
      search_params?.locations == null &&
      search_params?.beneficiaire == null &&
      search_params?.domaines_fonctionnels == null &&
      search_params?.referentiels_programmation == null
    ) {
      return of();
    }

    const params = this._buildparams(search_params);

    return this.http.get<DataPagination<FinancialDataModel>>(`${this._apiFinancialAe}/ae?${params}`);
  }


  private _buildparams( 
    { beneficiaire, bops, themes, locations, years, domaines_fonctionnels, referentiels_programmation }: SearchParameters
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

    if (locations && locations.length > 0) {
      const listCode = locations.map((l) => l.code).join(',');
      params += `&code_geo=${listCode}`
    }

    if (years && years.length > 0) {
      params += `&annee=${years.join(',')}`;
    }

    if (domaines_fonctionnels && domaines_fonctionnels.length > 0)
      params += `&domaine_fonctionnel=${domaines_fonctionnels.join(',')}`;
    
    if (referentiels_programmation && referentiels_programmation.length > 0)
      params += `&referentiel_programmation=${referentiels_programmation.join(',')}`;

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
