import { inject } from "@angular/core";
import { GeoHttpService, LimitHandler, FuzzySearchParamsBuilder } from "../../services/geo-http.service";
import { GeoModel, TypeLocalisation } from "../../models/geo.models";
import { Observable } from "rxjs";

export class GeoLocalisationComponentService {

    private geo = inject(GeoHttpService);

    public filterGeo(
        term: string | null,
        type: TypeLocalisation
    ): Observable<GeoModel[]> {

        let limit_handler: LimitHandler = (search, type, defaultLimit) => {
            let limit = defaultLimit;

            switch(type) {
                case TypeLocalisation.DEPARTEMENT:
                    limit = 500;
                    break;
                case TypeLocalisation.EPCI:
                    if (Object.keys(search).length > 0) // Si on recherche un EPCI, on retourne les 5 premiers résultats, sinon default
                        limit = 5;
                    break;
                case TypeLocalisation.COMMUNE:
                case TypeLocalisation.CRTE:
                    limit = 100;
                    break;
                case TypeLocalisation.ARRONDISSEMENT:
                    limit = 100;
            }

            return { ...search, limit }
        }
        

        let builder = new FuzzySearchParamsBuilder()
            .withDefaultLimit(100)
            .withLimitHandler(limit_handler);

        let search_params = builder.search(term, type);

        return this.geo.search(type, search_params);
    }
}