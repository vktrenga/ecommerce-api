export interface QueryFilter {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
}

export interface Pagination {
  totalRecords?: number;
  currentPage?: number;
  totalPages?: number;
  recordPerPage?: number;
}

