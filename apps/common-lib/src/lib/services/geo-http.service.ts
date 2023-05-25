import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, InjectionToken, inject } from "@angular/core";

import { GeoArrondissementModel, TypeLocalisation } from "../models/geo.models";
import { GeoModel } from "../models/geo.models";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ReferentielResponse } from '../models/pagination/referentiel-response.models';

/**
 * Injection token for the API path.
 */
export const API_GEO_PATH = new InjectionToken<string>('API GEO');
/**

 * Injection token for the API path CRTE.
 */
export const API_REF_PATH = new InjectionToken<string>('API REF');

/** 
 * Paramètres de recherche pour une localisation géographique à utiliser
 * voir GeoHttpService.search
 */
interface SearchParams {
    [key: string]: any
}


@Injectable({
    providedIn: 'root'
})
export class GeoHttpService {

    private http = inject(HttpClient);
    private readonly api_geo = inject(API_GEO_PATH);
    private readonly api_ref = inject(API_REF_PATH);

    public search(
        type: TypeLocalisation,
        search_param: SearchParams,
    ): Observable<GeoModel[]> {

        const base = this._baseUrl(type);
        const str_params = this._to_query_paramstr(search_param);

        const url = `${base}?${str_params}`

        return this.http.get<GeoModel[]>(url)
            .pipe(map(payload => {
                const mapped = this._api_to_service_mapper(type, payload);
                return mapped;
            }));
    }

    private _baseUrl(type: TypeLocalisation): string {

        let base = ''

        switch (type) {
            case TypeLocalisation.CRTE:
            case TypeLocalisation.ARRONDISSEMENT:
                base = `${this.api_ref}`
                break;
            default:
                base = `${this.api_geo}`
                break;
        }

        let segment = '';
        switch (type) {
            case TypeLocalisation.ARRONDISSEMENT:
                segment = 'arrondissement';
                break;
            case TypeLocalisation.COMMUNE:
                segment = 'communes';
                break;
            case TypeLocalisation.CRTE:
                segment = 'crte';
                break;
            case TypeLocalisation.DEPARTEMENT:
                segment = 'departements';
                break;
            case TypeLocalisation.EPCI:
                segment = 'epcis';
                break;
            default:
                throw new Error(`Non géré: ${type}`);
        }

        return `${this._remove_trailing_slash(base)}/${segment}`
    }

    private _remove_trailing_slash(s: string) {

        if (s.endsWith('/'))
            return s.slice(0, -1)
        return s
    }

    private _to_query_paramstr(search_params: SearchParams) {
        let params = new HttpParams()

        for (const key in search_params) {
            if (Object.prototype.hasOwnProperty.call(search_params, key)) {
                const v = search_params[key];

                params = params.set(key, v);
            }
        }

        const str_params = params.toString();
        return str_params;
    }

    private _api_to_service_mapper(type: TypeLocalisation, geos: GeoModel[]) {

        if (type === TypeLocalisation.ARRONDISSEMENT) {
            let payload = geos as unknown as ReferentielResponse<GeoArrondissementModel>

            return payload.items.map(arr => {
                return {
                    nom: arr.label,
                    code: arr.code,
                    type: TypeLocalisation.ARRONDISSEMENT
                } as GeoModel
            })
        }

        return geos.map(geo => {
            return { ...geo, type: type }
        });
    }
}




type _Term = string | null;


/** Gère le paramètre de limite de SearchParams. A utiliser avec un ASearchParamsBuilder pour personnaliser le calcul de cet argument. */
export type LimitHandler = (search_params: SearchParams, type: TypeLocalisation, default_limit: number) => SearchParams;

/**
 * Construit un SearchParams.
 * 
 * ```
 * let builder = SearchParamsBuilder();
 * let terme = 'Rennes';
 * let type = TypeLocalisation.Commune;
 * let searchParams = builder.search(terme, type)
 * let response = geoService.search(searchParams, type)
 * ```
 */
abstract class ASearchParamsBuilder {
    protected _defaultLimit = 100;
    protected _limitHandler: LimitHandler;

    constructor() {
        this._limitHandler = (search) => {
            return { ...search, limit: this._defaultLimit };
        }
    }

    public withDefaultLimit(n: number) {
        this._defaultLimit = n;
        return this;
    }

    public withLimitHandler(handler: LimitHandler) {
        this._limitHandler = handler;
        return this;
    }

    search(term: _Term, type: TypeLocalisation): SearchParams {

        let params = this.make_search_params(term, type);
        params = this._limitHandler(params, type, this._defaultLimit);

        if (type === TypeLocalisation.COMMUNE)
            params = this.add_fields_commune(params);

        return params;
    }

    protected abstract make_search_params(term: _Term, type: TypeLocalisation): SearchParams;

    protected add_fields_commune(search_params: SearchParams): SearchParams {
        return { ...search_params, fields: 'nom,code,codeDepartement' }
    }
}

/** 
 * Construit les SearchParams pour une recherche geo.
 * 'Devine' les paramètres de recherche selon le terme recherché.
 * 
 * Exemple:
 *   FuzzySearchParamsBuilder().search(35, TypeLocalisation.Commune)
 *      On considèrera le terme recherché comme étant un code de département.
 *   FuzzySearchParamsBuilder().search(35000, TypeLocalisation.Commune)
 *      On considèrera le terme recherché comme étant un code postal.
 * 
 * Ce builder est adapté pour les recherches faites par un utilisateur sur les emplacements géographiques.
 */
export class FuzzySearchParamsBuilder extends ASearchParamsBuilder {

    override make_search_params(term: _Term, type: TypeLocalisation): SearchParams {
        return this.fuzzy(term, type);
    }

    public fuzzy(term: _Term, type: TypeLocalisation): SearchParams {

        let search_params: SearchParams;
        switch (type) {

            case TypeLocalisation.ARRONDISSEMENT:
                search_params = this._arrondissement_fuzzy(term);
                break;
            case TypeLocalisation.COMMUNE:
                search_params = this._commune_fuzzy(term);
                break;
            case TypeLocalisation.CRTE:
                search_params = this._crte_fuzzy(term);
                break;
            case TypeLocalisation.DEPARTEMENT:
                search_params = this._departement_fuzzy(term);
                break;
            case TypeLocalisation.EPCI:
                search_params = this._epci_fuzzy(term);
                break;
            default:
                throw new Error(`Non géré: ${type}`);
        }

        return search_params;
    }

    private _arrondissement_fuzzy(term: _Term): SearchParams {

        if (term) return { query: term }
        else return {}
    }

    private _commune_fuzzy(term: _Term): SearchParams {

        if (!term) return {};

        let params: SearchParams = {};
        if (!isNaN(Number(term))) {
            if (term.length <= 2) {
                params = { codeDepartement: term }
            } else if (term.length === 5) {
                params = { codePostal: term };
            } else {
                params = { code: term };
            }
        } else {
            params = { nom: term };
        }
        return params;
    }

    private _crte_fuzzy(term: _Term): SearchParams {

        if (!term) return {}

        let params: SearchParams = {}
        if (!isNaN(Number(term)) && term.length <= 2) {
            params = { departement: term };
        } else {
            params = { nom: term };
        }
        return params;
    }

    private _departement_fuzzy(term: _Term): SearchParams {

        if (!term) return {}

        let params: SearchParams = {}
        if (term.length <= 2 && !isNaN(Number(term.substring(0, 1)))) {
            params = { code: term };
        } else {
            params = { nom: term };
        }
        return params;
    }

    private _epci_fuzzy(term: _Term) {

        if (!term) return {}

        let params: SearchParams = {}
        if (term.length <= 9 && !isNaN(Number(term.substring(0, 8)))) {
            params = { code: term }
        } else {
            params = { nom: term }
        }
        return params
    }
}

/**
 * Construit les SearchParams pour une recherche geo.
 * 
 * Recherche sur le cog (code officiel géographique). Adapté pour les API.
 */
export class SearchByCodeParamsBuilder extends ASearchParamsBuilder {

    override make_search_params(term: _Term, type: TypeLocalisation): SearchParams {

        let search_params: SearchParams;

        switch(type) {
            case TypeLocalisation.ARRONDISSEMENT:
                search_params = { query: term };
                break;
            case TypeLocalisation.COMMUNE:
                search_params = { code: term };
                break;
            case TypeLocalisation.CRTE:
                search_params = { nom: term };
                break;
            case TypeLocalisation.DEPARTEMENT:
                search_params = { code: term };
                break;
            case TypeLocalisation.EPCI:
                search_params = { code: term };
                break;
            default:
                throw new Error(`Non géré: ${type}`);
        }
        
        return search_params;
    }
}