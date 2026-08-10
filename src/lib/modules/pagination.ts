export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export interface NormalizedPagination {
  page: number;
  pageSize: number;
  from: number;
  to: number;
}

export function normalizePagination(
  input: PaginationInput,
  options: {
    defaultPageSize?: number;
    minPageSize?: number;
    maxPageSize?: number;
  } = {},
): NormalizedPagination {
  const defaultPageSize = options.defaultPageSize ?? 10;
  const minPageSize = options.minPageSize ?? 5;
  const maxPageSize = options.maxPageSize ?? 50;
  const page = Math.max(1, Math.trunc(input.page ?? 1));
  const pageSize = Math.min(
    maxPageSize,
    Math.max(minPageSize, Math.trunc(input.pageSize ?? defaultPageSize)),
  );
  const from = (page - 1) * pageSize;

  return { page, pageSize, from, to: from + pageSize - 1 };
}
