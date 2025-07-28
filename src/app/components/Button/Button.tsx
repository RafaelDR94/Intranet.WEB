// src/app/components/Button/Button.tsx
import React from 'react'
import clsx from 'clsx'
import ArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg'
import ArrowUp from '@/assets/icons/navegacion/arrow-up.svg'
import { ButtonProps } from './types'
import { baseClasses, sizeMap, variantMap } from './styles'


/**
 * Botón reutilizable con soporte para variantes de tamaño, color y dirección de flecha.
 * 
 * @param variant Variante visual del botón (`solid`, `outline`, etc.)
 * @param size Tamaño del botón (`small`, `medium`, `large`)
 * @param arrowDirection Dirección del ícono flecha (`right`, `up`)
 * @param iconOnly Si es solo ícono sin texto
 * @param disabled Si está deshabilitado
 */

export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  size = 'medium',
  arrowDirection = 'right',
  iconOnly = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  const sizeClasses = sizeMap[size]
  const variantClasses = variantMap[variant]
  const Icon = arrowDirection === 'right' ? ArrowRight : ArrowUp

  return (
    <button
      className={clsx(baseClasses, sizeClasses, variantClasses, className)}
      disabled={disabled}
      {...props}
    >
      {!iconOnly && <span>{children}</span>}
      <Icon
        className={clsx(!iconOnly && 'ml-2 transition-transform', 'text-inherit')}
      />
    </button>
  )
}
