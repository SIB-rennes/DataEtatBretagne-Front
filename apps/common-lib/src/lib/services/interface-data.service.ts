import { Observable } from 'rxjs';
import { DataPagination } from '../models/pagination/pagination.models';
import { RefSiret } from '@models/refs/RefSiret';
import { BopModel } from '@models/refs/bop.models';
import { GeoModel } from '../models/geo.models';

export interface SearchParameters {
    bops: BopModel[] | null;
    beneficiaire: RefSiret | null;
    years: number[] | null;
    locations: GeoModel[] | null,  
    themes: string[] | null;

    domaines_fonctionnels: string[] | null; 
    referentiels_programmation: string[] | null;
    source_region: string[] | null;
}

export const SearchParameters_empty: SearchParameters = {
  bops: null,
  beneficiaire: null,
  years: null,
  locations: null,
  themes: null,

  domaines_fonctionnels: null,
  referentiels_programmation: null,
  source_region: null,
}

/**
 * Interface Http Service pour remonter des informations dans une application type Budget
 * T étant le type métier
 * M le modèle générique
 */
export interface DataHttpService<T,M> {

  search(search_parameters: SearchParameters): Observable<DataPagination<T> | null>;

  getById(id: any, ...options: any[]): Observable<T>;

  mapToGeneric(object: T): M;

  getSource(): string;
}
