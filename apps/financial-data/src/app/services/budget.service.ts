import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  FinancialDataModelV2,
} from '@models/financial-data.models';
import { DataHttpService, GeoModel, NocoDbResponse } from 'apps/common-lib/src/public-api';
import { RefSiret } from '@models/RefSiret';
import { BopModel } from '@models/bop.models';
import { RefTheme } from '@models/theme.models';
import { Observable, forkJoin, map, of } from 'rxjs';
import { SettingsService } from '../../environments/settings.service';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import { HttpClient } from '@angular/common/http';

export const MY_INTERFACE_TOKEN = new InjectionToken<DataHttpService>(
  'DataHttpService'
);

@Injectable({ providedIn: 'root' })
export class BudgetService {

  private _apiTheme!: string;
  private _apiSiret!: string;
  private _apiProgramme!: string;


  constructor(
    private http: HttpClient,
    @Inject(MY_INTERFACE_TOKEN) private services: DataHttpService[],
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
      (service) => service.search(beneficiaire,  year, location, bops, themes)
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

  private _filterRefSiretWhereClause(nomOuSiret: string): string {
    nomOuSiret = encodeURIComponent(nomOuSiret);
    let is_number = /^\d+$/.test(nomOuSiret);

    if (is_number) return `where=(Code,like,${nomOuSiret}%)`;
    else return `where=(Denomination,like,${nomOuSiret})`;
  }
}
