import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { MarqueBlancheParsedParams, MarqueBlancheParsedParamsResolverModel } from "../../models/marqueblanche/marqueblanche-parsed-params.model";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators"

/** Wrapper pour gérer les erreurs dans les resolver de la marque blanche 
 * ```
 *  funtion resolverFn: Observable<T> {
 *    ... logique du resolver
 *  }
 *  export const resolver = passing_errors(resolverFn)
 * ```
 */
export function passing_errors<
    U extends MarqueBlancheParsedParams,
    T extends MarqueBlancheParsedParamsResolverModel<U>
>(fn: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<T>): ResolveFn<T> {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        try {
            let result = fn(route, state) as Observable<T>;
            return result
                .pipe(
                    catchError(error => {
                        return of({ error } as T);
                    })
                );
        } catch (error) {
            return { error } as T
        }
    }
}