'use client';

import React, { useEffect, useState } from 'react';

import { paginationDotsStyles } from './styles';
import { Props } from './types';

/**
 * Componente de paginaciÇün visual mediante puntos.
 *
 * Muestra una ventana limitada de puntos para representar pÇ­ginas y
 * flechas laterales para desplazarse cuando hay muchas pÇ­ginas.
 *
 * @param totalPages NÇ§mero total de pÇ­ginas disponibles
 * @param currentPage Ç?ndice de la pÇ­gina activa
 * @param onPageChange FunciÇün callback que se dispara al seleccionar una nueva pÇ­gina
 */
const PaginationDots = ({ totalPages, currentPage, onPageChange }: Props) => {
  const windowSize = 7; // máximo número de puntos visibles
  const [windowStart, setWindowStart] = useState(0);

  useEffect(() => {
    if (currentPage < windowStart) {
      setWindowStart(currentPage);
    } else if (currentPage >= windowStart + windowSize) {
      setWindowStart(currentPage - windowSize + 1);
    }
  }, [currentPage, windowStart]);

  /**
   * Determina la clase de tamaÇño del punto segÇ§n su posición dentro de la ventana.
   *
   * - Los primeros 5 puntos son de tamaÇño normal.
   * - El 6.¶§ es mediano, el 7.¶§ pequeÇño.
   *
   * @param indexInWindow Ç?ndice del punto en la ventana (basado en 0)
   * @returns Clase CSS correspondiente al tamaÇño
   */
  const getSizeClass = (indexInWindow: number) => {
    if (indexInWindow <= 4) return paginationDotsStyles.normalSize;
    if (indexInWindow === 5) return paginationDotsStyles.mediumSize;
    if (indexInWindow === 6) return paginationDotsStyles.smallSize;
    return 'hidden';
  };

  const canGoPrev = windowStart > 0;
  const canGoNext = windowStart + windowSize < totalPages;
  const visibleCount = Math.min(windowSize, totalPages - windowStart);

  const handlePrevWindow = () => {
    if (!canGoPrev) return;
    const newStart = Math.max(0, windowStart - windowSize);
    setWindowStart(newStart);
  };

  const handleNextWindow = () => {
    if (!canGoNext) return;
    const remaining = totalPages - (windowStart + windowSize);
    const shift = Math.min(windowSize, remaining);
    const newStart = windowStart + shift;
    setWindowStart(newStart);
  };

  return (
    <div className={paginationDotsStyles.paginationCtn}>
      {totalPages > windowSize && (
        <button
          type="button"
          onClick={handlePrevWindow}
          disabled={!canGoPrev}
          aria-label="PÇ­ginas anteriores"
          className={paginationDotsStyles.arrowButton}
        >
          ‹
        </button>
      )}

      {Array.from({ length: visibleCount }).map((_, idxInWindow) => {
        const index = windowStart + idxInWindow;
        const isActive = index === currentPage;
        const sizeClass = getSizeClass(idxInWindow);
        const colorClass = isActive
          ? paginationDotsStyles.buttonIsActive
          : paginationDotsStyles.buttonIsInactive;

        return (
          <button
            key={index + 1}
            type="button"
            onClick={() => onPageChange(index)}
            aria-label={`PÇ­gina ${index + 1}`}
            className={`rounded-full transition-all duration-200 ${colorClass} ${sizeClass}`}
          />
        );
      })}

      {totalPages > windowSize && (
        <button
          type="button"
          onClick={handleNextWindow}
          disabled={!canGoNext}
          aria-label="PÇ­ginas siguientes"
          className={paginationDotsStyles.arrowButton}
        >
          ›
        </button>
      )}
    </div>
  );
};

export default PaginationDots;

