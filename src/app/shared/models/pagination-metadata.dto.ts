export interface PaginationMetaDto {
  page: number;
  limit: number;
  itemCount: number;
  totalItems: number;
  pageCount: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}