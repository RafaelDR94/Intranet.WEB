// src/app/components/Button/Button.tsx
import React from 'react'
import clsx from 'clsx'
import ArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg'
import ArrowUp from '@/assets/icons/navegacion/arrow-up.svg'
import { ButtonProps } from './types'
import { baseClasses, sizeMap, variantMap } from './styles'

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
