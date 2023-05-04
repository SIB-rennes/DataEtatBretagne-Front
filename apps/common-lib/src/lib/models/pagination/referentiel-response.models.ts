import { PageSize } from './pagesize.models';

export interface ReferentielResponse<T> {
  items: T[];
  pageInfo: PageSize;
}
