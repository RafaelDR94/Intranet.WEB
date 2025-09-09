import clsx from 'clsx';
import React from 'react';

import { tabStyles } from './styles';
import { TabProps } from './types';

import FastArrowRightIcon from '@/assets/icons/navegacion/fast-arrow-right.svg';

/**
 * Pestaña (`Tab`) reutilizable para interfaces por categorías o secciones.
 *
 * Cambia de estilo según su estado: **seleccionada**, **deshabilitada** o **interactiva**.
 * No gestiona estado interno; es un componente **controlado** por el padre.
 *
 * @remarks
 * - Úsalo dentro de un contenedor con `role="tablist"` (p. ej. `Tabs`).
 * - Dispara `onClick` cuando se selecciona; el padre debe actualizar `selected`.
 *
 * @accessibility
 * - Expone `role="tab"` y `aria-selected` para lectores de pantalla.
 * - Usa `disabled` para marcar pestañas no disponibles (`aria-disabled`).
 *
 * @example
 * ```tsx
 * <div role="tablist" aria-label="Secciones">
 *   <Tab label="General"  selected onClick={() => setTab('general')} />
 *   <Tab label="Detalles" disabled onClick={() => setTab('detalles')} />
 *   <Tab label="Historial" onClick={() => setTab('historial')} />
 * </div>
 * ```
 */
export const Tab: React.FC<TabProps> = ({
  label,
  selected = false,
  disabled = false,
  onClick,
}) => {
  // Determina el color de texto basado en el estado de la pestaña
  const getTextColor = () => {
    if (disabled) return tabStyles.disabled;
    if (selected) return tabStyles.selected;
    return 'text-green-90';
  };

  const ArrowIcon = FastArrowRightIcon;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        tabStyles.base,
        getTextColor(),
        !selected && !disabled && tabStyles.hover,
        !selected && !disabled && tabStyles.focus,
        selected && tabStyles.selected,
        disabled && tabStyles.disabled
      )}
    >
      {/* Etiqueta del tab */}
      <span className={tabStyles.tabLabel}>{label}</span>

      {/* Icono de flecha que indica navegación */}
      <ArrowIcon className={tabStyles.tabIcon} />
    </button>
  );
};
