import { PageSize } from './pagesize.models';

export interface DataPagination<T> {
  items:  T[];
  pageInfo?: PageSize;
}
