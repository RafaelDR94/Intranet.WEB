'use client';

import React from 'react';
import { PaginationProps } from './types';
import { container } from './styles';
import usePagination from './hooks/usePagination';
/**
 * Paginador simple con botones numerados y flechas anterior/siguiente.
 *
 * @remarks
 * - Componente **controlado**: renderiza en función de `currentPage` y `totalPages`;
 *   debes actualizar `currentPage` en tu estado al recibir `onPageChange`.
 * - Deshabilita automáticamente:
 *   - la flecha izquierda cuando `currentPage === 1`
 *   - la flecha derecha cuando `currentPage === totalPages`
 *   - el botón de la página actual
 *
 * @accessibility
 * - Las flechas incluyen `aria-label` descriptivos.
 * - El botón de la página actual expone `aria-current="page"`.
 * - Son botones nativos, por lo que admiten navegación por teclado de forma estándar.
 *
 * @example
 * ```tsx
 * const [page, setPage] = useState(1);
 * <Pagination
 *   currentPage={page}
 *   totalPages={12}
 *   onPageChange={(p) => setPage(p)}
 * />
 * ```
 */
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const { getPageClass, getArrowClass } = usePagination(currentPage);

  const renderPages = () =>
    Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        className={getPageClass(i + 1)}
        onClick={() => onPageChange(i + 1)}
        disabled={i + 1 === currentPage}
      >
        {i + 1}
      </button>
    ));

  return (
    <div className={container}>
      <button
        className={getArrowClass(currentPage === 1)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &#x2039;
      </button>
      {renderPages()}
      <button
        className={getArrowClass(currentPage === totalPages)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &#x203A;
      </button>
    </div>
  );
};

export default Pagination;
