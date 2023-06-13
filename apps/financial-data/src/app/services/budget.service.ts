import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  FinancialDataModel, HEADERS_CSV_FINANCIAL,
} from '@models/financial/financial-data.models';
import { DataHttpService, GeoModel, NocoDbResponse } from 'apps/common-lib/src/public-api';
import { RefSiret } from '@models/refs/RefSiret';
import { BopModel } from '@models/refs/bop.models';
import { RefTheme } from '@models/refs/theme.models';
import { Observable, forkJoin, map, of } from 'rxjs';
import { SettingsService } from '../../environments/settings.service';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import { HttpClient } from '@angular/common/http';
import { DataPagination } from 'apps/common-lib/src/lib/models/pagination/pagination.models';
import { SourceFinancialData } from '@models/financial/common.models';

export const DATA_HTTP_SERVICE = new InjectionToken<DataHttpService<any, FinancialDataModel>>(
  'DataHttpService'
);

@Injectable({ providedIn: 'root' })
export class BudgetService {

  private _apiSiret!: string;


  constructor(
    private http: HttpClient,
    @Inject(DATA_HTTP_SERVICE) private services: DataHttpService<any, FinancialDataModel>[],
    @Inject(SETTINGS) readonly settings: SettingsService
  ) {
    const project = this.settings.projectFinancial;
    let base_uri = this.settings.nocodbProxy?.base_uri;
    if (project && base_uri) {
      base_uri += project.table + '/';
      this._apiSiret = base_uri + project.views.siret;
    }
  }

  public search(
    beneficiaire: RefSiret | null,
    bops: BopModel[] | null,
    themes: RefTheme[] | null,
    year: number[] | null,
    location: GeoModel[] | null
  ): Observable<FinancialDataModel[]> {
    const search$: Observable<FinancialDataModel[]>[] = this.services.map(service =>
      service.search(beneficiaire, year, location, bops, themes).pipe(
        map((resultPagination: DataPagination<any> | null) => {
          if (resultPagination === null || resultPagination.pageInfo === undefined) return [];
          if (resultPagination.pageInfo.totalRows > resultPagination.pageInfo.pageSize) {
            throw new Error(`La limite de lignes de résultat est atteinte. Veuillez affiner vos filtres afin d'obtenir un résultat complet.`);
          }
          return resultPagination.items;
        }),
        map(items => items.map(data => service.mapToGeneric(data)))
      )
    );


    return forkJoin(search$).pipe(
      map((response) => {
        return response.flatMap( data => [...data])
      })
    );
  }

  public filterRefSiret(nomOuSiret: string): Observable<RefSiret[]> {
    let whereClause = this._filterRefSiretWhereClause(nomOuSiret);

    return this.http
      .get<NocoDbResponse<RefSiret>>(
        `${this._apiSiret}?fields=Code,Denomination&sort=Code&${whereClause}`
      )
      .pipe(map((response) => response.list));
  }


  public getCsv(financialData: FinancialDataModel[]): Blob {
    const csvRows = [];
    csvRows.push(HEADERS_CSV_FINANCIAL.join(','));
    for (const item of financialData) {

      const values = [
        item.source,
        item.n_ej,
        item.n_poste_ej,
        item.montant_ae,
        item.montant_cp,
        item.programme.theme ?? '',
        item.programme.code  ?? '',
        item.programme.label.replace(/"/g, '""') ?? '',
        item.referentiel_programmation.label.replace(/"/g, '""') ?? '',
        item.commune.label ?? '',
        item.siret.code,
        item.siret.nom_beneficiare.replace(/"/g, '""') ?? '',
        item.siret.categorie_juridique ?? '',
        item.date_cp,
        item.annee
      ];
      csvRows.push(values.join(','));
    }
    return  new Blob( [csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  }

  public getById(source: SourceFinancialData, id: number) :Observable<FinancialDataModel> {
    const service = this.services.find(s => s.getSource() === source);
    if (service === undefined) return of()

    return service.getById(id).pipe(
      map(data => service.mapToGeneric(data))
    );
  }

  private _filterRefSiretWhereClause(nomOuSiret: string): string {
    nomOuSiret = encodeURIComponent(nomOuSiret);
    let is_number = /^\d+$/.test(nomOuSiret);

    if (is_number) return `where=(Code,like,${nomOuSiret}%)`;
    else return `where=(Denomination,like,${nomOuSiret})`;
  }
}
