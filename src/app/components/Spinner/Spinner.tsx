import React from 'react';
import clsx from 'clsx';
import { SpinnerSize } from './types';
import { sizeClasses} from './styles';
/**
 * Componente visual de Spinner (cargador animado).
 * 
 * Muestra un círculo animado que gira, útil para representar estados de carga.
 * Admite 5 tamaños distintos según el diseño.
 * 
 * @param size - Tamaño del spinner. Opciones: 'giant', 'large', 'medium', 'small', 'tiny'.
 * @returns JSX.Element
 */
export const Spinner = ({ size = 'medium' }: { size?: SpinnerSize }) => {
  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-transparent border-l-green-90',
        sizeClasses[size]
      )}
    />
  );
};