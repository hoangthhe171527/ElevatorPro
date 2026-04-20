export function usePagination<T>(items: T[], pageSize = 8) {
  return {
    paginate: (page: number) => items.slice((page - 1) * pageSize, page * pageSize),
    totalPages: Math.ceil(items.length / pageSize),
    pageSize,
  };
}
