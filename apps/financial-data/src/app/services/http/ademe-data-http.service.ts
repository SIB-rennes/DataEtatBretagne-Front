import { Inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AdemeData } from '@models/financial/ademe.models';
import {
  DataHttpService,
  SearchParameters,
} from 'apps/common-lib/src/public-api';
import { FinancialDataModel } from '@models/financial/financial-data.models';
import { SourceFinancialData } from '@models/financial/common.models';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import { SettingsService } from 'apps/financial-data/src/environments/settings.service';
import { DataPagination } from 'apps/common-lib/src/lib/models/pagination/pagination.models';
import { NGXLogger } from 'ngx-logger';
/**
 * POC de l'inégratoin des données ADEME
 */
@Injectable({
  providedIn: 'root',
})
export class AdemeDataHttpService implements DataHttpService<AdemeData,FinancialDataModel> {
  private _api! : string

  constructor(private http: HttpClient, @Inject(SETTINGS) readonly settings: SettingsService, private logger: NGXLogger) {
    this._api = this.settings.apiFinancialData
  }

  search(
    { bops, beneficiaires, locations, years, domaines_fonctionnels, referentiels_programmation, source_region }: SearchParameters
  ): Observable<DataPagination<AdemeData> | null> {

    if (
      bops?.findIndex((bop) => bop.code === 'ADEME') === -1 
      || (domaines_fonctionnels && domaines_fonctionnels.length > 0)
      || (referentiels_programmation && referentiels_programmation.length > 0)
      || (source_region && source_region.length > 0)
    ) {
      this.logger.debug(`On ne recherche pas sur les données de l'ademe`);
      return of(null);
    }

    let params ='limit=5000';
    if (beneficiaires && beneficiaires.length > 0) {
      params += `&siret_beneficiaire=${beneficiaires.map(x => x.siret).join(',')}`;
    }
    if (locations && locations.length > 0) {
      const listCode = locations.map((l) => l.code).join(',');
      params += `&code_geo=${listCode}`

    }

    if (years && years.length > 0) {
      params += `&annee=${years.join(',')}`;
    }

    return this.http.get<DataPagination<AdemeData>>(`${this._api}/ademe?${params}`);
  }


  getById(id: any): Observable<AdemeData> {
    return this.http.get<AdemeData>(`${this._api}/ademe/${id}`);
  }

  mapToGeneric(ademe: AdemeData): FinancialDataModel {
    const date_versement = ademe.dates_periode_versement.split("_")

    return {
      id: ademe.id,
      source: SourceFinancialData.ADEME,
      montant_ae: ademe.montant,
      montant_cp:  ademe.montant,
      commune: ademe.commune,
      programme: {label : 'ADEME', theme:"Ecologie, développement et mobilité durables"},
      referentiel_programmation: {
        label: ademe.objet,
        code : ''
      },

      n_ej: ademe.reference_decision,
      n_poste_ej: 0,

      annee: Number(ademe.date_convention.substring(0,4)),

      siret: ademe.siret_beneficiaire,

      date_cp: date_versement[date_versement.length - 1]
    }
  }

  getSource(): string {
    return SourceFinancialData.ADEME;
  }
}
