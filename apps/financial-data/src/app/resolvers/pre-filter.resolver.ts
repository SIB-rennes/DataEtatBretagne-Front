import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { QueryParam } from '@models/marqueblanche/query-params.model';
import { PreFilter } from '@models/search/prefilter.model';
import { TOrError } from '@models/t-or-error.model';
import { GeoHttpService, GeoModel, TypeLocalisation, filterGeo } from 'apps/common-lib/src/public-api';
import { JSONObject } from 'apps/preference-users/src/lib/models/preference.models';
import { NGXLogger } from 'ngx-logger';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';

export type PrefilterResolverModel = TOrError<PreFilter | null>

export const resolvePreFilter: ResolveFn<PrefilterResolverModel> = _passing_errors(_resolver)

const niveauxLocalisationLegaux = [
  TypeLocalisation.DEPARTEMENT,
  TypeLocalisation.EPCI,
  TypeLocalisation.COMMUNE,
]

function _resolver(route: ActivatedRouteSnapshot) {

  let logger = inject(NGXLogger);
  let api_geo = inject(GeoHttpService)

  const empty: PrefilterResolverModel = { data: null }

  let preFilters: PreFilter = {};

  let uuid = route.queryParamMap.get(QueryParam.Uuid);

  if (uuid) {
    logger.debug("Paramètre UUID présent. on ne calcule pas les filtres marque blanche");
    return of(empty);
  }

  let model = programmes(route, preFilters)
    .pipe(
      mergeMap(preFilters => localisation(api_geo, route, preFilters)),
      map(preFilters => {
        if (Object.keys(preFilters).length === 0)
          return empty;

        return {
          data: preFilters
        }
      })
    )

  return model;
};

/** Gère le filtre des programmes */
function programmes(route: ActivatedRouteSnapshot, preFilter: PreFilter): Observable<PreFilter> {

  let programmes = route.queryParamMap.get(QueryParam.Programmes);
  if (programmes) {
    let codes: string[] = programmes.split(',')
    let bops = codes.map(code => {
      return { 'Code': code }
    });

    preFilter = {
      ...preFilter,
      bops,
    }
  }

  return of(preFilter);
}

/** Gère le préfiltre de localisation*/
function localisation(api_geo: GeoHttpService, route: ActivatedRouteSnapshot, preFilter: PreFilter): Observable<PreFilter> {

  let p_niveau_geo = route.queryParamMap.get(QueryParam.Niveau_geo);
  let p_code_geo = route.queryParamMap.get(QueryParam.Code_geo);

  if (_bxor(p_niveau_geo, p_code_geo))
    throw Error("Vous devez utiliser `niveau_geo` et `code_geo` ensemble.")
  if (!p_niveau_geo) // Aucun paramètre renseigné
    return of(preFilter);

  let niveau_geo = p_niveau_geo! as TypeLocalisation;
  let code_geo = p_code_geo!;

  if (!niveauxLocalisationLegaux.includes(niveau_geo))
    throw Error(`Le niveau géographique doit être une de ces valeurs ${niveauxLocalisationLegaux}`)

  function handle_geo(geo: GeoModel[]) {
    if (geo.length !== 1)
      throw new Error(`Impossible de trouver une localisation pour ${niveau_geo}: ${code_geo}`);
    let result = {
      ...preFilter,
      location: [geo[0]] as unknown as JSONObject[] // TODO: gérer N codes geos ?
    }
    return result;
  }

  let result = filterGeo(api_geo, code_geo, niveau_geo)
    .pipe(
      map(geo => handle_geo(geo))
    );

  return result;
}

function _passing_errors(fn: ResolveFn<PrefilterResolverModel>): ResolveFn<PrefilterResolverModel> {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    try {
      let result = fn(route, state) as Observable<PrefilterResolverModel>;
      return result
        .pipe(
          catchError(error => {
            return of({ error });
          })
        );
    } catch (error) {
      return { error }
    }
  }
}

function _bxor(x: any, y: any) {
  let bx = Number(Boolean(x));
  let by = Number(Boolean(y));

  return Boolean(bx ^ by);
}