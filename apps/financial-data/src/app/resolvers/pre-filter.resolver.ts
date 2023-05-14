import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { PreFilter } from '@models/search/prefilter.model';
import { NGXLogger } from 'ngx-logger';

export const resolvePreFilter: ResolveFn<PreFilter | null> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

      let logger = inject(NGXLogger);

      let preFilters: PreFilter = {};

      let uuid = route.queryParamMap.get('uuid');
      let programmes = route.queryParamMap.get('programmes');

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

      if (Object.keys(preFilters).length === 0)
        return null
      return preFilters;
    };
