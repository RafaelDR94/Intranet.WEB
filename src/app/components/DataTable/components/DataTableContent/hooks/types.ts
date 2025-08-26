
export type SortDirection = "asc" | "desc" | null;

export interface UseTableContentProps<T> {
  data: T[];
  defaultSortKey?: keyof T;
  defaultSortDirection?: SortDirection;
}
/** Props adicionales para paginación/scroll */
export interface UseDataTableContentProps<T> extends UseTableContentProps<T> {
  enablePagination?: boolean;
  rowsPerPage?: number;
  totalRows?: number;
  enableInternalSearch?: boolean;
  onPageChange?: (page: number) => void;
  /** alto estimado de cada fila, en px */
  rowHeight?: number;
  /** si lo defines, este valor manda (px o cualquier CSS válido) */
  scrollMaxHeight?: number | string;
}


