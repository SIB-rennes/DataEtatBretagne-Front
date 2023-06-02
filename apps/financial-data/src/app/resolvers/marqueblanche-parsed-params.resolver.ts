import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { QueryParam } from '@models/marqueblanche/query-params.model';
import { PreFilters } from '@models/search/prefilters.model';
import { TOrError } from '@models/t-or-error.model';
import { GeoHttpService, SearchByCodeParamsBuilder } from 'apps/common-lib/src/lib/services/geo-http.service';
import { GeoModel, TypeLocalisation } from 'apps/common-lib/src/public-api';
import { JSONObject } from 'apps/preference-users/src/lib/models/preference.models';
import { NGXLogger } from 'ngx-logger';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';

export interface MarqueBlancheParsedParams {
  preFilters: PreFilters,
  has_marqueblanche_params: boolean,
}
export type MarqueBlancheParsedParamsResolverModel = TOrError<MarqueBlancheParsedParams | null>

export const resolveMarqueBlancheParsedParams: ResolveFn<MarqueBlancheParsedParamsResolverModel> = _passing_errors(_resolver)

const niveauxLocalisationLegaux = [
  TypeLocalisation.DEPARTEMENT,
  TypeLocalisation.EPCI,
  TypeLocalisation.COMMUNE,
]

interface _FilterFnParams {
  preFilters: PreFilters,
  route: ActivatedRouteSnapshot,
  logger: NGXLogger,
}
interface _LocalisationFnParams extends _FilterFnParams {
  api_geo: GeoHttpService,
}

function _resolver(route: ActivatedRouteSnapshot) {

  let logger = inject(NGXLogger);
  let api_geo = inject(GeoHttpService)

  const empty: MarqueBlancheParsedParamsResolverModel = { data: null }

  let preFilters: PreFilters = {};

  let uuid = route.queryParamMap.get(QueryParam.Uuid);

  if (uuid) {
    logger.debug("Paramètre UUID présent. on ne calcule pas les filtres marque blanche");
    return of(empty);
  }

  let has_marqueblanche_params: boolean = false;
  for (const p_name of Object.values(QueryParam)) {
    has_marqueblanche_params = has_marqueblanche_params || route.queryParamMap.has(p_name);
  }
  

  let model = of(preFilters)
    .pipe(
      mergeMap(preFilters => programmes({ preFilters, route, logger })),
      mergeMap(preFilters => localisation({ api_geo, route, preFilters, logger })),
      map(preFilters => annees_min_max({ preFilters, route, logger })),
      map(preFilters => {
        if (Object.keys(preFilters).length === 0)
          return empty;

        return {
          data: { preFilters, has_marqueblanche_params }
        }
      })
    )

  return model;
};

/** Gère le filtre des programmes */
function programmes({ preFilters, route, logger }: _FilterFnParams): Observable<PreFilters> {

  let programmes = route.queryParamMap.get(QueryParam.Programmes);
  if (programmes) {
    let codes: string[] = programmes.split(',')
    logger.debug(`Application du paramètre ${QueryParam.Programmes}: ${codes}`);
    let bops = codes.map(code => {
      return { 'Code': code }
    });

    preFilters = {
      ...preFilters,
      bops,
    }
  }

  return of(preFilters);
}

/** Gère le préfiltre de localisation*/
function localisation({ api_geo, preFilters, route, logger }: _LocalisationFnParams): Observable<PreFilters> {

  let p_niveau_geo = route.queryParamMap.get(QueryParam.Niveau_geo);
  let p_code_geo = route.queryParamMap.get(QueryParam.Code_geo);

  if (_xor(p_niveau_geo, p_code_geo))
    throw Error("Vous devez utiliser `niveau_geo` et `code_geo` ensemble.")
  if (!p_niveau_geo) // Aucun paramètre renseigné
    return of(preFilters);

  let niveau_geo = p_niveau_geo! as TypeLocalisation;
  let code_geo = p_code_geo!;

  if (!niveauxLocalisationLegaux.includes(niveau_geo))
    throw Error(`Le niveau géographique doit être une de ces valeurs ${niveauxLocalisationLegaux}`)

  function handle_geo(geo: GeoModel[]) {
    if (geo.length !== 1)
      throw new Error(`Impossible de trouver une localisation pour ${niveau_geo}: ${code_geo}`);
    let result = {
      ...preFilters,
      location: [geo[0]] as unknown as JSONObject[] // XXX: Ici, on ne gère qu'un seul code_geo
    }
    return result;
  }

  logger.debug(`Application des paramètres ${QueryParam.Niveau_geo}: ${niveau_geo} et ${QueryParam.Code_geo}: ${code_geo}`);
  let result = filterGeo(api_geo, code_geo, niveau_geo)
    .pipe(
      map(geo => handle_geo(geo))
    );

  return result;
}

function annees_min_max({ preFilters, route, logger }: _FilterFnParams): PreFilters {

  const annee_courante = new Date().getFullYear();

  let p_annee_min = route.queryParamMap.get(QueryParam.Annee_min);
  let p_annee_max = route.queryParamMap.get(QueryParam.Annee_max);

  if (_xor(p_annee_min, p_annee_max))
    throw new Error('Veuillez spécifier deux paramètres: "annee_min" et "annee_max"');

  if (!p_annee_min && !p_annee_max) {
    // Par défaut, l'année en cours
    logger.debug(`Application du paramètre d'année: année courante (${annee_courante})`);

    return preFilters = {
      ...preFilters,
      year: [annee_courante],
    }
  }

  let i_annee_min = _parse_annee(p_annee_min);
  let i_annee_max = _parse_annee(p_annee_max);
  let annee_min = (i_annee_min <= i_annee_max)? i_annee_min: i_annee_max;
  let annee_max = (i_annee_min <= i_annee_max)? i_annee_max: i_annee_min;
  
  let pf_annees = []
  for (let annee = annee_min; annee <= annee_max; annee++)
    pf_annees.push(annee);
  
  if (pf_annees.length > 20)
    throw new Error(`Veuillez selectionner une fenêtre de temps < 20 ans en utilisant annee_min et annee_max`);
  if (annee_max > annee_courante)
    throw new Error(`Veuillez spécifier une année max correcte (<= année en cours)`);

  preFilters = {
    ...preFilters,
    year: pf_annees,
  }
  
  return preFilters;
}

function filterGeo(api_geo: GeoHttpService, code_geo: string, niveau_geo: TypeLocalisation) {

  let search_params = new SearchByCodeParamsBuilder()
    .withDefaultLimit(1)
    .search(code_geo, niveau_geo);

  return api_geo.search(niveau_geo, search_params);
}

/** Resolver angular qui transforme les exceptions en valeur de retour. */
function _passing_errors(fn: ResolveFn<MarqueBlancheParsedParamsResolverModel>): ResolveFn<MarqueBlancheParsedParamsResolverModel> {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    try {
      let result = fn(route, state) as Observable<MarqueBlancheParsedParamsResolverModel>;
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

function _xor(x: any, y: any) {
  let bx = Number(Boolean(x));
  let by = Number(Boolean(y));

  return Boolean(bx ^ by);
}

/** Parse une année. Exception au cas oú l'année est invalide  */
function _parse_annee(annee: string | null): number {
  if (!annee)
    throw new Error(`l'année n'est pas précisée`);
  
  if (/^\d{4}$/.test(annee)) {
    const integerValue = parseInt(annee, 10);
    return integerValue;
  }

  throw new Error(`L'année ${annee} est invalide`);
}