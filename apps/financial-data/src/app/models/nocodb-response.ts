import { PageSize } from './pagination/pagesize.models';

export interface NocoDbResponse<T> {
  list: T[];
  pageInfo: PageSize;
}
