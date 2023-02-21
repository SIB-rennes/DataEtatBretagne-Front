import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import {
  NocodbHttpService,
  NocoDbResponse,
} from 'apps/common-lib/src/public-api';
import { map, Observable } from 'rxjs';
import { SettingsService } from '../../environments/settings.service';
import { SousAxePlanRelance } from '../models/axe.models';
import { Structure } from '../models/structure.models';
import { Territoire } from '../models/territoire.models';

@Injectable({
  providedIn: 'root',
})
export class FranceRelanceHttpService extends NocodbHttpService {
  constructor(
    private http: HttpClient,
    @Inject(SETTINGS) readonly settings: SettingsService
  ) {
    super();
  }

  /**
   * Récupère les Axe du plan de relance
   * @returns
   */
  public getSousAxePlanRelance(): Observable<SousAxePlanRelance[]> {
    const apiFr = this.settings.apiFranceRelance;
    const field_sous_axe = 'SousaxeDuPlanDeRelance';
    const field_axe = 'AxeDuPlanDeRelance';

    const params = `fields=${field_sous_axe},${field_axe}&limit=5000&sort=${field_axe},${field_sous_axe}`;

    return this.http
      .get<NocoDbResponse<any>>(`${apiFr}/Dispositifs/Dispositifs?${params}`)
      .pipe(
        map((response: NocoDbResponse<any>) =>
          response.list.reduce((uniqueArray, current) => {
            const itemExists = uniqueArray.find(
              (item: { label: any }) => item.label === current[field_sous_axe]
            );
            if (!itemExists) {
              uniqueArray.push({
                label: current[field_sous_axe],
                axe: current[field_axe],
              });
            }
            return uniqueArray;
          }, [])
        )
      );
  }

  /**
   * Recherche de strucutre dans la base lauréat
   * @param search
   * @returns
   */
  public searchStructure(search: string): Observable<Structure[]> {
    const apiFr = this.settings.apiFranceRelance;

    const fields = 'Structure,NuméroDeSiretSiConnu';
    const sort = 'Structure';
    const where = `where=(Structure,like,${search}%)`;
    const params = `fields=${fields}&limit=50&sort=${sort}&${where}`;

    return this.http
      .get<NocoDbResponse<Structure[]>>(
        `${apiFr}/Laureats/Laureats-front?${params}`
      )
      .pipe(
        map((response: NocoDbResponse<any>) =>
          response.list.reduce((uniqueArray, current) => {
            const itemExists = uniqueArray.find(
              (item: { label: any; siret: any }) =>
                item.label === current['Structure'] &&
                item.siret === current['NuméroDeSiretSiConnu']
            );
            if (!itemExists) {
              uniqueArray.push({
                label: current['Structure'],
                siret: current['NuméroDeSiretSiConnu'],
              });
            }
            return uniqueArray;
          }, [])
        )
      );
  }

  /**
   * Lance la rechercher d'un territoire
   * @param search
   * @returns
   */
  public searchTerritoire(search: string): Observable<Territoire[]> {
    const apiFr = this.settings.apiFranceRelance;
    const fields = 'Commune,CodeInsee';
    const where = `where=(Commune,like,${search}%)`;

    const params = `fields=${fields}&limit=500&${where}&sort=Commune`;

    return this.http
      .get<NocoDbResponse<Territoire>>(
        `${apiFr}/LocalisationBretagne/LocalisationBretagne?${params}`
      )
      .pipe(map((response) => response.list));
  }

  /**
   * Lance la recherche des laureats sur la base France relance
   * @param axe
   * @returns
   */
  public searchFranceRelance(
    axes: SousAxePlanRelance[],
    structure: Structure,
    territoires: Territoire[]
  ): Observable<any> {
    const apiFr = this.settings.apiFranceRelance;

    const fields =
      'Structure,NuméroDeSiretSiConnu,SubventionAccordée,Synthèse,axe,sous-axe,dispositif,territoire,code_insee';
    const params = `fields=${fields}&${this._buildparams(
      axes,
      structure,
      territoires
    )}`;

    return this.mapNocoDbReponse(
      this.http.get<NocoDbResponse<any>>(
        `${apiFr}/Laureats/Laureats-front?${params}`
      )
    );
  }

  public getCsv(
    axes: SousAxePlanRelance[],
    structure: Structure,
    territoires: Territoire[]
  ): Observable<Blob> {
    const apiFr = this.settings.apiFranceRelance;

    const fields =
      'Structure,NuméroDeSiretSiConnu,SubventionAccordée,Synthèse,axe,sous-axe,dispositif,territoire,code_insee';
    const params = `fields=${fields}&${this._buildparams(
      axes,
      structure,
      territoires
    )}`;
    return this.http.get(`${apiFr}/Laureats/Laureats-front/csv?${params}`, {
      responseType: 'blob',
    });
  }

  private _buildparams(
    axes: SousAxePlanRelance[] | null,
    structure: Structure | null,
    territoires: Territoire[] | null
  ): string {
    let params =
      'sort=Structure,axe,dispositif&limit=5000&where=(Montant,gt,0)';
    if (structure) {
      params += `~and(Structure,eq,${structure.label})`;
    }

    if (axes && axes.length > 0) {
      params += `~and(sous-axe,in,${axes.map((axe) => axe.label).join(',')})`;
    }

    if (territoires && territoires.length > 0) {
      // on est toujours sur le même type
      params += `~and(territoire,in,${territoires
        .map((t) => t.Commune)
        .join(',')})`;
    }

    return params;
  }
}
