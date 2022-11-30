export interface ChorusResponse<T> {
  list: T[];
  pageInfo: PageSize;
}

export interface PageSize {
  totalRows: number;
  page: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}
