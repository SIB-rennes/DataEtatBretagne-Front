import { Observable, of } from "rxjs";
import { HandlerContext } from "../../models/marqueblanche/handler-context.model";
import { MarqueBlancheParsedParams } from "../../models/marqueblanche/marqueblanche-parsed-params.model";
import { QueryParam } from "../../models/marqueblanche/query-params.enum";

export type Handler<T extends MarqueBlancheParsedParams, V extends HandlerContext> = (parsedParams: T, ctx: V) => Observable<T>;

/** 
 * Handler du paramètre group by de la marque blanche
 * Extrait les noms de champs directement du paramètre {@link QueryParam.Group_by}
 * rempli uniquement le paramètre {@link MarqueBlancheParsedParams.p_group_by}
 */
export function p_group_by<T extends MarqueBlancheParsedParams, V extends HandlerContext>(previous: T, { route, logger }: V): Observable<T> {

    let route_group_by = route.queryParamMap.get(QueryParam.Group_by);

    if (!route_group_by)
        return of(previous)

    let params_group_by = route_group_by.split(',');
    logger.debug(`Application du paramètre ${QueryParam.Group_by}: ${params_group_by}`)

    const result: T = {
        ...previous,
        p_group_by: params_group_by,
    }
    return of(result)
}

/** Handler du paramètre fullscreen de la marque blanche*/
export function fullscreen<T extends MarqueBlancheParsedParams, V extends HandlerContext>(previous: T, { route, logger }: V): Observable<T> {
  let p_fullscreen = route.queryParamMap.get(QueryParam.Fullscreen);

  if (p_fullscreen)
    logger.debug(`Application du paramètre ${QueryParam.Fullscreen}: ${p_fullscreen}`);
  return of({
    ...previous,
    fullscreen: _parse_bool(p_fullscreen),
  })
}

function _parse_bool(s: string | null): boolean {
  if ("true" === s)
    return true
  if ("false" === s)
    return false
  
  return Boolean(s)
}