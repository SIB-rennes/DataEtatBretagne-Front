import { Inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AdemeData } from '@models/financial/ademe.models';
import {
  DataHttpService,
  GeoModel,
} from 'apps/common-lib/src/public-api';
import { RefSiret } from '@models/refs/RefSiret';
import { BopModel } from '@models/refs/bop.models';
import { FinancialDataModel } from '@models/financial/financial-data.models';
import { SourceFinancialData } from '@models/financial/common.models';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import { SettingsService } from 'apps/financial-data/src/environments/settings.service';
import { DataPagination } from 'apps/common-lib/src/lib/models/pagination/pagination.models';
/**
 * POC de l'inégratoin des données ADEME
 */
@Injectable({
  providedIn: 'root',
})
export class AdemeDataHttpService implements DataHttpService<AdemeData,FinancialDataModel> {
  private _api! : string

  constructor(private http: HttpClient,  @Inject(SETTINGS) readonly settings: SettingsService) {
    this._api = this.settings.apiFinancialData
  }

  search(
    beneficiaire: RefSiret | null,
    year: number[] | null,
    locations: GeoModel[] | null,
    bops: BopModel[] | null
  ): Observable<DataPagination<AdemeData> | null> {
    if (bops?.findIndex((bop) => bop.code === 'ADEME') === -1) {
      return of(null);
    }

    let params ='limit=5000';
    if (beneficiaire) {
      params += `&siret_beneficiaire=${beneficiaire.siret}`;
    }
    if (locations && locations.length > 0) {
      const listCode = locations.map((l) => l.code).join(',');
      params += `&code_geo=${listCode}`

    }

    if (year && year.length > 0) {
      params += `&annee=${year.join(',')}`;
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
