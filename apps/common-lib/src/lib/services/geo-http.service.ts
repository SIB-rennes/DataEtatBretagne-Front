import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  GeoCommuneModel,
  GeoModel,
  TypeLocalisation,
} from '../models/geo.models';

/**
 * Injection token for the API path.
 */
export const API_GEO_PATH = new InjectionToken<string>('API GEO');

/**
 * Injection token for the API path CRTE.
 */
export const API_REF_PATH = new InjectionToken<string>('API REF');

/**
 * Service to handle HTTP requests related to Geo data.
 */
@Injectable({
  providedIn: 'root',
})
export class GeoHttpService {
  constructor(
    private http: HttpClient,
    @Inject(API_GEO_PATH) private readonly apiGeo: string,
    @Inject(API_REF_PATH) private readonly apiRef: string
  ) {}

  /**
   * Filters departments by search query.
   * @param search The search query.
   * @returns An observable of an array of GeoModel objects representing the filtered departments.
   */
  public filterDepartement(search: string | null): Observable<GeoModel[]> {
    let params = 'limit=500';
    if (search) {
      if (search.length <= 2 && !isNaN(Number(search.substring(0, 1)))) {
        params += `&code=${search}`;
      } else {
        params += `&nom=${search}`;
      }
    }
    console.log(this.apiGeo);
    return this.http
      .get<GeoModel[]>(`${this.apiGeo}/departements?${params}`)
      .pipe(
        map((arrayGeo: GeoModel[]) => {
          return arrayGeo.map((geo: GeoModel) => {
            return { ...geo, type: TypeLocalisation.DEPARTEMENT };
          });
        })
      );
  }

  /**
   * Filters epcis by search query.
   * @param search The search query.
   * @returns An observable of an array of GeoModel objects representing the filtered epcis.
   */
  public filterEpci(search: string | null): Observable<GeoModel[]> {
    let params = '';
    if (search) {
      params += 'limit=5';
      if (search.length <= 8 && !isNaN(Number(search.substring(0, 7)))) {
        params += `&code=${search}`;
      } else {
        params += `&nom=${search}`;
      }
    }
    return this.http.get<GeoModel[]>(`${this.apiGeo}/epcis?${params}`).pipe(
      map((arrayGeo: GeoModel[]) => {
        return arrayGeo.map((geo: GeoModel) => {
          return { ...geo, type: TypeLocalisation.EPCI };
        });
      })
    );
  }

  /**
   * Filters commune by search query.
   * @param search The search query.
   * @returns An observable of an array of GeoCommuneModel objects representing the filtered communes.
   */
  public filterCommune(search: string | null): Observable<GeoCommuneModel[]> {
    // TODO rendre le codeDepartement par défaut paramétrable
    let params = 'codeDepartement=35&limit=500';
    if (search) {
      params = 'limit=500';
      if (!isNaN(Number(search))) {
        if (search.length <= 2) {
          params += `&codeDepartement=${search}`;
        } else if (search.length == 5) {
          params += `&codePostal=${search}`;
        } else {
          params += `&code=${search}`;
        }
      } else {
        params = `&nom=${search}&limit=100`;
      }
    }
    return this.http
      .get<GeoCommuneModel[]>(
        `${this.apiGeo}/communes?${params}&fields=nom,code,codeDepartement`
      )
      .pipe(
        map((arrayGeo: GeoCommuneModel[]) => {
          return arrayGeo.map((geo: GeoCommuneModel) => {
            return { ...geo, type: TypeLocalisation.COMMUNE };
          });
        })
      );
  }

  /**
   * Filters Crte by search query.
   * @param search The search query.
   * @returns An observable of an array of GeoModel objects representing the filtered CRTE.
   */
  public filterCrte(search: string | null): Observable<GeoModel[]> {
    // TODO rendre le codeDepartement par défaut paramétrable
    let params = 'departement=01&limit=500';
    if (search) {
      params = 'limit=100';
      if (!isNaN(Number(search)) && search.length <= 2) {
        params += `&departement=${search}`;
      } else {
        params += `&nom=${search}`;
      }
    }

    return this.http.get<GeoModel[]>(`${this.apiRef}/crte?${params}`).pipe(
      map((arrayGeo: GeoModel[]) => {
        return arrayGeo.map((geo: GeoModel) => {
          return { ...geo, type: TypeLocalisation.CRTE };
        });
      })
    );
  }
}
