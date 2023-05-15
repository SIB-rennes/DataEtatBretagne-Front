import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { PreFilter } from '@models/search/prefilter.model';
import { TOrError } from '@models/t-or-error.model';
import { NGXLogger } from 'ngx-logger';

export type PrefilterResolverModel = TOrError<PreFilter> | null

export const resolvePreFilter: ResolveFn<PrefilterResolverModel> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

      let logger = inject(NGXLogger);

      let preFilters: PreFilter = {};

      let uuid = route.queryParamMap.get('uuid');
      let programmes = route.queryParamMap.get('programmes');
      let annee_min = route.queryParamMap.get('annee_min');
      let annee_max = route.queryParamMap.get('annee_max')

      if (uuid) {
        logger.debug("Paramètre UUID présent. on ne calcule pas les filtres marque blanche");
        return null;
      }


      if (programmes) {
        let codes: string[] = programmes.split(',')
        let bops = codes.map(code => {
          return { 'Code': code }
        });

        preFilters = {
          ...preFilters,
          bops,
        }
      }

      /*
       *
       * Année min
       * Année max
       * 
       * 
       */

      // if (annee_min && _is_number(annee_min)) {
      //   preFilters = {
      //     ...preFilters,
      //     // annee_min,
      //   }
      // }


      if (Object.keys(preFilters).length === 0)
        return null
      return { 
        data: preFilters
      }
    };

function _is_number(x: any) {
  return typeof x === 'number';
}