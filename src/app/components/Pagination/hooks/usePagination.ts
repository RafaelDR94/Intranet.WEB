/**
 * Hook para manejar la lógica de estilos de Pagination.
 * Devuelve funciones helper para obtener clases de página y flechas.
 */
import { pageButton, arrowButton } from '../styles';

export const usePagination = (currentPage: number) => {
  const getPageClass = (page: number) => pageButton(currentPage === page, currentPage === page);
  const getArrowClass = (disabled: boolean) => arrowButton(disabled);
  return { getPageClass, getArrowClass };
};

export default usePagination;