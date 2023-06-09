import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdemeData } from '@models/financial/ademe.models';
import {
  DataHttpService,
  GeoModel,
  TypeLocalisation,
} from 'apps/common-lib/src/public-api';
import { RefSiret } from '@models/refs/RefSiret';
import { BopModel } from '@models/refs/bop.models';
import { FinancialDataModelV2 , SourceFinancialData} from '@models/financial/financial-data.models';
/**
 * POC de l'inégratoin des données ADEME
 */
@Injectable({
  providedIn: 'root',
})
export class AdemeDataHttpService implements DataHttpService<AdemeData,FinancialDataModelV2> {


  constructor(private http: HttpClient) {}

  search(
    _beneficiaire: RefSiret | null,
    year: number[] | null,
    locations: GeoModel[] | null,
    bops: BopModel[] | null
  ): Observable<AdemeData[]> {
    if (
      locations?.findIndex(
        (location) =>
          location.type === TypeLocalisation.DEPARTEMENT &&
          location.code === '35'
      ) === -1 ||
      bops?.findIndex((bop) => bop.Code === 'ADEME') === -1
    ) {
      return of([]);
    }

    return this._search(year);
  }

  private _search(year: number[] | null): Observable<AdemeData[]> {

    return this.http.get<AdemeData[]>('./assets/ademe_35.json').pipe(
      map((data) => {
        const ademes =  Object.values(data);
        if (year && year.length > 0) {
          return  ademes.filter(ademe =>  {
            const annee = Number(ademe.date_convention.substring(0,4));
            return year.findIndex( y => y === annee) !== -1;
          });
        }
        return ademes;

      })
    );
  }

  getById(id: any, ...options: any[]): Observable<AdemeData> {
    throw new Error('Method not implemented.');
  }

  mapToGeneric(ademe: AdemeData): FinancialDataModelV2 {
    const date_versement = ademe.dates_periode_versement.split("_")

    return {
      id: -1,
      source: SourceFinancialData.ADEME,
      montant_ae: ademe.montant,
      montant_cp:  ademe.montant,
      commune: {label: 'Departement 35', code : "35"},
      programme: {label : 'ADEME', code: 'ADEME', theme:""},
      referentiel_programmation: {
        label: ademe.objet,
        code : ''
      },

      n_ej: ademe.reference_decision,
      n_poste_ej: 0,

      annee: Number(ademe.date_convention.substring(0,4)),

      siret: {code: ademe.siret, nom_beneficiare: ademe.nom_beneficiaire},

      date_cp: date_versement[date_versement.length - 1]
    }
  }

  getSource(): string {
    return SourceFinancialData.ADEME;
  }
}
