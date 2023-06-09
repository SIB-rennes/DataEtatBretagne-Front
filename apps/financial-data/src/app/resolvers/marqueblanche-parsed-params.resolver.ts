import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { PreFilters } from '@models/search/prefilters.model';
import { GeoHttpService, SearchByCodeParamsBuilder } from 'apps/common-lib/src/lib/services/geo-http.service';
import { GeoModel, TypeLocalisation } from 'apps/common-lib/src/public-api';
import { JSONObject } from 'apps/preference-users/src/lib/models/preference.models';
import { NGXLogger } from 'ngx-logger';
import { Observable, map, mergeMap, of } from 'rxjs';

import {
  MarqueBlancheParsedParams as Params,
  MarqueBlancheParsedParamsResolverModel as ResolverModel
} from 'apps/common-lib/src/lib/models/marqueblanche/marqueblanche-parsed-params.model';
import { FinancialQueryParam } from '@models/marqueblanche/query-params.enum';
import { QueryParam } from 'apps/common-lib/src/lib/models/marqueblanche/query-params.enum';
import { p_group_by as common_group_by, fullscreen } from 'apps/common-lib/src/lib/resolvers/marqueblanche/common-handlers';
import { HandlerContext } from 'apps/common-lib/src/lib/models/marqueblanche/handler-context.model';
import { passing_errors } from 'apps/common-lib/src/lib/resolvers/marqueblanche/utils';
import { assert_is_a_GroupByFieldname } from '@models/marqueblanche/groupby-fieldname.enum';
import { GroupingColumn } from 'apps/grouping-table/src/lib/components/grouping-table/group-utils';
import { groupby_mapping } from '@models/marqueblanche/groupby-mapping.model';

export interface MarqueBlancheParsedParams extends Params {
  preFilters: PreFilters,
}
export type MarqueBlancheParsedParamsResolverModel = ResolverModel<MarqueBlancheParsedParams>

/** Resolver qui parse les paramètres de la marque blanche */
export const resolveMarqueBlancheParsedParams: ResolveFn<MarqueBlancheParsedParamsResolverModel> = passing_errors(_resolver)

const niveauxLocalisationLegaux = [
  TypeLocalisation.DEPARTEMENT,
  TypeLocalisation.EPCI,
  TypeLocalisation.COMMUNE,
]

/** Paramètres pour une fonction qui calcule les pré-filtres*/
interface _HandlerContext extends HandlerContext {
  route: ActivatedRouteSnapshot,
  logger: NGXLogger,
  api_geo: GeoHttpService,
}

function _resolver(route: ActivatedRouteSnapshot): Observable<{ data: MarqueBlancheParsedParams }> {

  let logger = inject(NGXLogger);
  let api_geo = inject(GeoHttpService)

  let empty: MarqueBlancheParsedParams = { preFilters: {}, p_group_by: [], group_by: [], has_marqueblanche_params: false, fullscreen: false }

  let uuid = route.queryParamMap.get(QueryParam.Uuid);

  if (uuid) {
    logger.debug("Paramètre UUID présent. on ne calcule pas les filtres marque blanche");
    return of(
      { data: empty }
    );
  }

  let has_marqueblanche_params = false;
  for (const p_name of Object.values(FinancialQueryParam)) {
    has_marqueblanche_params = has_marqueblanche_params || route.queryParamMap.has(p_name);
  }

  let handlerCtx = { api_geo, route, logger };
  let model = of({ ...empty, has_marqueblanche_params })
    .pipe(
      mergeMap(previous => programmes(previous, handlerCtx)),
      mergeMap(previous => localisation(previous, handlerCtx)),

      mergeMap(previous => common_group_by(previous, handlerCtx)),
      mergeMap(previous => group_by(previous, handlerCtx)),

      map(previous => annees_min_max(previous, handlerCtx)),
      mergeMap(previous => fullscreen<MarqueBlancheParsedParams, HandlerContext>(previous, handlerCtx)),
      map(result => {
        return { data: result }
      })
    )

  return model;
};

/** Renseigne les {@link GroupingColumn} suivant {@link MarqueBlancheParsedParams.p_group_by}*/
function group_by(
  previous: MarqueBlancheParsedParams,
  ctx: _HandlerContext,
): Observable<MarqueBlancheParsedParams> {

  let columns: GroupingColumn[] = []
  for (const param_name of previous.p_group_by) {

    assert_is_a_GroupByFieldname(param_name)
    let columnName = groupby_mapping[param_name]
    let column: GroupingColumn = { columnName }

    columns.push(column);
  }

  return of(
    {
      ...previous,
      group_by: columns,
    }
  )
}

/** Gère le préfiltre des programmes */
function programmes(
  { preFilters, has_marqueblanche_params, p_group_by, group_by, fullscreen }: MarqueBlancheParsedParams,
  { route, logger }: _HandlerContext,
): Observable<MarqueBlancheParsedParams> {

  let programmes = route.queryParamMap.get(FinancialQueryParam.Programmes);
  if (programmes) {
    let codes: string[] = programmes.split(',')
    logger.debug(`Application du paramètre ${FinancialQueryParam.Programmes}: ${codes}`);
    let bops = codes.map(code => {
      return { 'Code': code }
    });

    preFilters = {
      ...preFilters,
      bops,
    }
  }

  return of(
    { preFilters, has_marqueblanche_params, p_group_by, group_by, fullscreen }
  );
}

/** Gère le préfiltre de localisation*/
function localisation(
  previous: MarqueBlancheParsedParams,
  { api_geo, route, logger }: _HandlerContext,
): Observable<MarqueBlancheParsedParams> {

  let p_niveau_geo = route.queryParamMap.get(FinancialQueryParam.Niveau_geo);
  let p_code_geo = route.queryParamMap.get(FinancialQueryParam.Code_geo);

  if (_xor(p_niveau_geo, p_code_geo))
    throw Error("Vous devez utiliser `niveau_geo` et `code_geo` ensemble.")
  if (!p_niveau_geo) // Aucun paramètre renseigné
    return of(previous);

  let niveau_geo = p_niveau_geo! as TypeLocalisation;
  let code_geo = p_code_geo!;

  if (!niveauxLocalisationLegaux.includes(niveau_geo))
    throw Error(`Le niveau géographique doit être une de ces valeurs ${niveauxLocalisationLegaux}`)

  function handle_geo(geo: GeoModel[]) {
    if (geo.length !== 1)
      throw new Error(`Impossible de trouver une localisation pour ${niveau_geo}: ${code_geo}`);
    let _preFilters: PreFilters = {
      ...previous.preFilters,
      location: [geo[0]] as unknown as JSONObject[] // XXX: Ici, on ne gère qu'un seul code_geo
    }
    return {
      ...previous,
      preFilters: _preFilters
    };
  }

  logger.debug(`Application des paramètres ${FinancialQueryParam.Niveau_geo}: ${niveau_geo} et ${FinancialQueryParam.Code_geo}: ${code_geo}`);
  let result = filterGeo(api_geo, code_geo, niveau_geo)
    .pipe(
      map(geo => handle_geo(geo))
    );

  return result;
}

/** Gère le préfiltre des années */
function annees_min_max(
  previous: MarqueBlancheParsedParams,
  { route, logger }: _HandlerContext,
): MarqueBlancheParsedParams {

  const annee_courante = new Date().getFullYear();

  let p_annee_min = route.queryParamMap.get(FinancialQueryParam.Annee_min);
  let p_annee_max = route.queryParamMap.get(FinancialQueryParam.Annee_max);

  if (_xor(p_annee_min, p_annee_max))
    throw new Error('Veuillez spécifier deux paramètres: "annee_min" et "annee_max"');

  if (!p_annee_min && !p_annee_max) {
    // Par défaut, l'année en cours
    logger.debug(`Application du paramètre d'année: année courante (${annee_courante})`);

    let _preFilters = {
      ...previous.preFilters,
      year: [annee_courante],
    }
    return {
      ...previous,
      preFilters: _preFilters,
    }
  }

  let i_annee_min = _parse_annee(p_annee_min);
  let i_annee_max = _parse_annee(p_annee_max);
  let annee_min = (i_annee_min <= i_annee_max) ? i_annee_min : i_annee_max;
  let annee_max = (i_annee_min <= i_annee_max) ? i_annee_max : i_annee_min;

  let pf_annees = []
  for (let annee = annee_min; annee <= annee_max; annee++)
    pf_annees.push(annee);

  if (pf_annees.length > 20)
    throw new Error(`Veuillez selectionner une fenêtre de temps < 20 ans en utilisant annee_min et annee_max`);
  if (annee_max > annee_courante)
    throw new Error(`Veuillez spécifier une année max correcte (<= année en cours)`);

  let _preFilters = {
    ...previous.preFilters,
    year: pf_annees,
  }

  return { ...previous, preFilters: _preFilters };
}

//region fonctions utilitaires
function filterGeo(api_geo: GeoHttpService, code_geo: string, niveau_geo: TypeLocalisation) {

  let search_params = new SearchByCodeParamsBuilder()
    .withDefaultLimit(1)
    .search(code_geo, niveau_geo);

  return api_geo.search(niveau_geo, search_params);
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

//endregion