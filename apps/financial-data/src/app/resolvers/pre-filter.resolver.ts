import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { QueryParam } from '@models/marqueblanche/query-params.model';
import { PreFilter } from '@models/search/prefilter.model';
import { TOrError } from '@models/t-or-error.model';
import { NGXLogger } from 'ngx-logger';

export type PrefilterResolverModel = TOrError<PreFilter | null>

export const resolvePreFilter: ResolveFn<PrefilterResolverModel> = _passing_errors(_resolver)

function _resolver(route: ActivatedRouteSnapshot) {

  let logger = inject(NGXLogger);
  const empty: PrefilterResolverModel = { data: null }

  let preFilters: PreFilter = {};

  let uuid = route.queryParamMap.get(QueryParam.Uuid);

  if (uuid) {
    logger.debug("Paramètre UUID présent. on ne calcule pas les filtres marque blanche");
    return empty;
  }

  preFilters = programmes(route, preFilters);
  preFilters = localisation(route, preFilters);

  if (Object.keys(preFilters).length === 0)
    return empty;

  return {
    data: preFilters
  }
};

/** Gère le filtre des programmes */
function programmes(route: ActivatedRouteSnapshot, preFilter: PreFilter): PreFilter {

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

  return preFilter;
}

/** Gère le préfiltre de localisation*/
function localisation(route: ActivatedRouteSnapshot, preFilter: PreFilter): PreFilter {

  let niveau_geo = route.queryParamMap.get(QueryParam.Niveau_geo);
  let code_geo = route.queryParamMap.get(QueryParam.Code_geo);

  if (_bxor(niveau_geo, code_geo))
    throw Error("Vous devez utiliser `niveau_geo` et `code_geo` ensemble.")

  // TODO: remplir le preFilter
  preFilter = {
    ...preFilter,
  };

  return preFilter;
}

function _passing_errors(fn: ResolveFn<PrefilterResolverModel>): ResolveFn<PrefilterResolverModel> {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    try {
      return fn(route, state);
    } catch (error) {
      return { error: error }
    }
  }
}

function _bxor(x: any, y: any) {
  let bx = Number(Boolean(x));
  let by = Number(Boolean(y));

  return Boolean(bx ^ by);
}