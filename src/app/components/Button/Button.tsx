

// src/app/components/Button/Button.tsx
'use client';

import clsx from 'clsx';
import React from 'react';

import { baseClasses, sizeMap, variantMap } from './styles';
import { ButtonProps } from './types';

import CancelIcon from '@/assets/icons/acciones/cancel.svg';
import ArrowUp from '@/assets/icons/navegacion/arrow-up.svg';
import ArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg';


/**
 * Botón reutilizable con soporte para:
 *  - variantes de estilo (`variant`).
 *  - tamaños (`size`).
 *  - dirección de flecha por defecto (`arrowDirection`).
 *  - renderizado de icono personalizado (`icon`).
 *  - modo solo icono (`iconOnly`).
 *  - estado deshabilitado (`disabled`).
 *
 * @param variant    Variante visual del botón (`solid`, `outline`, `ghost`).
 * @param size       Tamaño del botón (`small`, `medium`, `large`).
 * @param arrowDirection Dirección del ícono flecha por defecto (`right`, `up`, `cancel`).
 * @param iconOnly   Si es solo ícono sin texto (oculta children).
 * @param icon       Icono custom (componente SVG). Anula `arrowDirection`.
 * @param disabled   Si está deshabilitado.
 * @param children   Texto o nodos hijos.
 * @param hideIcon   Esconde el icono;
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  size = 'medium',
  arrowDirection = 'right',
  iconOnly = false,
  disabled = false,
  hideIcon=false,
  icon,
  className,
  children,
  dataTestId,
  ...props
}) => {
  const sizeClasses = sizeMap[size];
  const variantClasses = variantMap[variant];

  // Determina icono por defecto según arrowDirection
  let IconDefault = ArrowRight;
  if (arrowDirection === 'up') IconDefault = ArrowUp;
  else if (arrowDirection === 'cancel') IconDefault = CancelIcon;

  // Usa icon custom si se proporciona, sino el default
  const IconToRender = icon ?? IconDefault;

    return (
      <button
        data-testid={dataTestId}
        className={clsx(baseClasses, sizeClasses, variantClasses, className)}
        disabled={disabled}
        {...props}
      >
      {!iconOnly && <span>{children}</span>}
      {!hideIcon && (
        <IconToRender
          className={clsx(!iconOnly && 'transition-transform', 'text-inherit')}
        />
      )}
    </button>
  );
};
