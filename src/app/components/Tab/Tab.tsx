import React from 'react';
import clsx from 'clsx';
import { tabStyles } from './styles';
import FastArrowRightIcon from '@/assets/icons/navegacion/fast-arrow-right.svg';
import { TabProps } from './types';

/**
 * Componente de pestaña (`Tab`) reutilizable.
 *
 * Se utiliza para representar una pestaña en interfaces de navegación o selección por categorías.
 * Cambia de estilo según su estado: seleccionado, deshabilitado o interactivo.
 *
 * @param label Texto visible de la pestaña.
 * @param selected Indica si la pestaña está actualmente seleccionada.
 * @param disabled Desactiva la pestaña si es `true`, impidiendo interacción.
 * @param onClick Función que se ejecuta al hacer clic sobre la pestaña.
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
