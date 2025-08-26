/** Props del componente `Pagination`. */
export interface PaginationProps {
  /** Página actual */
  currentPage: number;
  /** Número total de páginas */
  totalPages: number;
  /** Callback al cambiar de página */
  onPageChange: (page: number) => void;
}
