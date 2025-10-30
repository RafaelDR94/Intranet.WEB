import clsx from 'clsx';
import React from 'react';

import { sizeClasses} from './styles';
import { SpinnerProps } from './types';
/**
 * Componente visual de **Spinner** (cargador animado).
 *
 * Muestra un círculo que gira para indicar un estado de carga. Admite cinco tamaños
 * y puede comportarse como **decorativo** o anunciar progreso a lectores de pantalla.
 *
 * @remarks
 * - Por defecto es **no decorativo** y expone `role="status"` + `aria-label="Cargando"`.
 * - Si lo usas dentro de otro contenedor que ya anuncia estado (p. ej. un overlay con
 *   `role="status"`), marca el spinner como `decorative` para evitar ruido accesible.
 *
 * @accessibility
 * - Usa `ariaLabel` para describir la acción (“Cargando datos”, “Guardando cambios”…).
 * - Si `decorative` es `true`, el componente incluye `aria-hidden` y omite el `role`.
 *
 * @example
 * ```tsx
 * // Spinner autónomo (anuncia "Cargando")
 * <Spinner size="medium" />
 *
 * // Spinner decorativo (el contenedor ya tiene role="status")
 * <div role="status" aria-live="polite">
 *   <Spinner size="small" decorative />
 *   Cargando reportes…
 * </div>
 *
 * // Con ariaLabel personalizado
 * <Spinner size="large" ariaLabel="Procesando pago" />
 * ```
 */
export const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', dataTestId }) => {
  return (
    <div
      data-testid={dataTestId}
      className={clsx(
        'animate-spin rounded-full border-transparent border-l-green-90',
        sizeClasses[size]
      )}
    />
  );
};