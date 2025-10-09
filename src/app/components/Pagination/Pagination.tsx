'use client';

import React from 'react';

import usePagination from './hooks/usePagination';
import { container ,arrowButton, pageButton} from './styles';
import { PaginationProps } from './types';
import { useIsMobile } from '../DataTable/components/DataTableLayout/hooks/useMediaQuery';
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
  const {
    items,                // (number | 'dots-left' | 'dots-right')[]
    canPrev,
    canNext,
    jumpLeft,             // () => number (página a saltar al pulsar '…' izquierda)
    jumpRight,            // () => number (página a saltar al pulsar '…' derecha)
  } = usePagination(currentPage, totalPages);
  const isMobile = useIsMobile();
  return (
    <div className={container} role="navigation" aria-label="Pagination">
      {/* Prev */}
      <button
        className={arrowButton(!canPrev)}
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        disabled={!canPrev}
        aria-label="Página anterior"
      >
        &#x2039;
      </button>

      {/* Números + puntos */}
      {items.map((it, idx) => {
        if (it === 'dots-left') {
          return (
            <button
              key={`dl-${idx}`}
              className={pageButton(false, false,isMobile)}
              aria-label="Saltar hacia atrás"
              onClick={() => onPageChange(jumpLeft())}
            >
              …
            </button>
          );
        }
        if (it === 'dots-right') {
          return (
            <button
              key={`dr-${idx}`}
              className={pageButton(false, false,isMobile)}
              aria-label="Saltar hacia adelante"
              onClick={() => onPageChange(jumpRight())}
            >
              …
            </button>
          );
        }
        const pageNum = it as number;
        const isActive = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            className={pageButton(isActive, isActive,isMobile)}
            onClick={() => onPageChange(pageNum)}
            disabled={isActive}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Ir a la página ${pageNum}`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next */}
      <button
        className={arrowButton(!canNext)}
        onClick={() => canNext && onPageChange(currentPage + 1)}
        disabled={!canNext}
        aria-label="Página siguiente"
      >
        &#x203A;
      </button>
    </div>
  );
};

export default Pagination;