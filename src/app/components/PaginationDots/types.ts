/**
 * Props del componente `PaginationDots`.
 */
export type Props = {
  /** Número total de páginas disponibles en la paginación */
  totalPages: number;

  /** Página actualmente activa (índice basado en 0) */
  currentPage: number;

  /** Función que se ejecuta cuando se selecciona una nueva página */
  onPageChange: (page: number) => void;
};
