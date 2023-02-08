import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import { NocoDbResponse } from 'apps/common-lib/src/public-api';
import { map, Observable } from 'rxjs';
import { SettingsService } from '../../environments/settings.service';
import { SousAxePlanRelance } from '../models/axe.models';

@Injectable({
  providedIn: 'root',
})
export class FranceRelanceHttpService {
  constructor(
    private http: HttpClient,
    @Inject(SETTINGS) readonly settings: SettingsService
  ) {}

  /**
   * Récupère les Axe du plan de relance
   * @returns
   */
  public getSousAxePlanRelance(): Observable<SousAxePlanRelance[]> {
    const apiFr = this.settings.apiFranceRelance;
    const field_sous_axe = 'Sous-axe du plan de relance';
    const field_axe = 'Axe du plan de relance';

    const params = `fields=${field_sous_axe},${field_axe}&limit=5000&sort=${field_axe},${field_sous_axe}`;

    return this.http
      .get<NocoDbResponse<any>>(
        `${apiFr}/Tous les dispositifs (par ordre des mesures)/Grid view?${params}`
      )
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

  public searchFranceRelance(axe: SousAxePlanRelance[]): Observable<any> {
    const apiFr = this.settings.apiFranceRelance;

    if (axe && axe.length > 0) {
    }

    const fields =
      'Structure,Subvention accordée,Numéro de Siret (si connu),Type de structure,code_insee';
    const sort = 'Structure,Subvention accordée';
    const params = `fields=${fields}&limit=1000`;

    return this.http
      .get<NocoDbResponse<any>>(`${apiFr}/LAUREATS/Tous les lauréats?${params}`)
      .pipe(map((response) => response.list));
  }
}
