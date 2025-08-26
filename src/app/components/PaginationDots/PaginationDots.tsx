'use client';

import React from 'react';
import { paginationDotsStyles } from './styles';
import { Props } from './types';

/**
 * Componente de paginación visual mediante puntos.
 *
 * Muestra un conjunto limitado de puntos para representar páginas, 
 * donde el tamaño y visibilidad de cada punto se ajusta según su posición.
 *
 * Ideal para paginaciones simples donde se desea indicar 
 * visualmente la posición actual del usuario en una lista o carrusel.
 *
 * @param totalPages Número total de páginas disponibles
 * @param currentPage Índice de la página activa
 * @param onPageChange Función callback que se dispara al seleccionar una nueva página
 */
const PaginationDots = ({ totalPages, currentPage, onPageChange }: Props) => {
  /**
   * Determina la clase de tamaño del punto según su índice.
   *
   * - Los primeros 5 puntos son de tamaño normal.
   * - El 6.º es mediano, el 7.º pequeño.
   * - A partir del 8.º en adelante se ocultan.
   *
   * @param index Índice del punto (basado en 0)
   * @returns Clase CSS correspondiente al tamaño
   */
  const getSizeClass = (index: number) => {
    if (index <= 4) return paginationDotsStyles.normalSize;
    if (index === 5) return paginationDotsStyles.mediumSize;
    if (index === 6) return paginationDotsStyles.smallSize;
    return 'hidden';
  };

  return (
    <div className={paginationDotsStyles.paginationCtn}>
      {Array.from({ length: totalPages }).map((_, index) => {
        const isActive = index === currentPage;
        const sizeClass = getSizeClass(index);
        const colorClass = isActive
          ? paginationDotsStyles.buttonIsActive
          : paginationDotsStyles.buttonIsInactive;

        return (
          <button
            key={index + 1}
            onClick={() => onPageChange(index)}
            aria-label={`Página ${index + 1}`}
            className={`rounded-full transition-all duration-200 ${colorClass} ${sizeClass}`}
          />
        );
      })}
    </div>
  );
};

export default PaginationDots;
