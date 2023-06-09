import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  FinancialDataModelV2, HEADERS_CSV_FINANCIAL, SourceFinancialData,
} from '@models/financial/financial-data.models';
import { DataHttpService, GeoModel, NocoDbResponse } from 'apps/common-lib/src/public-api';
import { RefSiret } from '@models/refs/RefSiret';
import { BopModel } from '@models/refs/bop.models';
import { RefTheme } from '@models/refs/theme.models';
import { Observable, forkJoin, map, of } from 'rxjs';
import { SettingsService } from '../../environments/settings.service';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import { HttpClient } from '@angular/common/http';

export const DATA_HTTP_SERVICE = new InjectionToken<DataHttpService<any, FinancialDataModelV2>>(
  'DataHttpService'
);

@Injectable({ providedIn: 'root' })
export class BudgetService {

  private _apiTheme!: string;
  private _apiSiret!: string;
  private _apiProgramme!: string;


  constructor(
    private http: HttpClient,
    @Inject(DATA_HTTP_SERVICE) private services: DataHttpService<any, FinancialDataModelV2>[],
    @Inject(SETTINGS) readonly settings: SettingsService
  ) {
    const project = this.settings.projectFinancial;
    let base_uri = this.settings.nocodbProxy?.base_uri;
    if (project && base_uri) {
      base_uri += project.table + '/';
      this._apiProgramme = base_uri + project.views.programmes;
      this._apiTheme = base_uri + project.views.themes;
      this._apiSiret = base_uri + project.views.siret;
    }
  }

  public search(
    beneficiaire: RefSiret | null,
    bops: BopModel[] | null,
    themes: RefTheme[] | null,
    year: number[] | null,
    location: GeoModel[] | null
  ): Observable<FinancialDataModelV2[]> {
    const search$: Observable<FinancialDataModelV2[]>[] = this.services.map(
      (service) =>
        service
          .search(beneficiaire, year, location, bops, themes)
          .pipe(map((resultSearch) => resultSearch.map(data => service.mapToGeneric(data))))
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


  public getCsv(financialData: FinancialDataModelV2[]): Blob {
    const csvRows = [];
    csvRows.push(HEADERS_CSV_FINANCIAL.join(','));
    for (const item of financialData) {

      const values = [
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

  public getById(source: SourceFinancialData, id: number) :Observable<FinancialDataModelV2> {
    const service = this.services.find(s => s.getSource() === source);
    if (service === undefined) return of()

    return service.getById(id);
  }

  private _filterRefSiretWhereClause(nomOuSiret: string): string {
    nomOuSiret = encodeURIComponent(nomOuSiret);
    let is_number = /^\d+$/.test(nomOuSiret);

    if (is_number) return `where=(Code,like,${nomOuSiret}%)`;
    else return `where=(Denomination,like,${nomOuSiret})`;
  }
}
