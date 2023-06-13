import { Observable } from 'rxjs';
import { DataPagination } from '../models/pagination/pagination.models';

/**
 * Interface Http Service pour remonter des informations dans une application type Budget
 * T étant le type métier
 * M le modèle générique
 */
export interface DataHttpService<T,M> {

  search( beneficiaire: any | null,
    year: number[] | null,
    location: any[] | null,  bops: any[] | null,
    themes: any[] | null,): Observable<DataPagination<T> | null>;

  getById(id: any, ...options: any[]): Observable<T>;

  mapToGeneric(object: T): M;

  getSource(): string;
}
