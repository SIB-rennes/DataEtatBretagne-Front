import { FinancialDataModelV2 } from '@models/financial-data.models';
import { Observable } from 'rxjs';

export interface DataHttpService {

  search( beneficiaire: any | null,
    year: number[] | null,
    location: any[] | null,  bops: any[] | null,
    themes: any[] | null,): Observable<FinancialDataModelV2[]>;

  getById(key: any, ...options: any[]): Observable<FinancialDataModelV2>;
}
