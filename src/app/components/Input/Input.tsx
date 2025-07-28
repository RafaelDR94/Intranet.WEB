'use client'

import React from 'react'
import clsx from 'clsx'
import {
  InputProps,
} from './types'
import {
  containerClasses,
  labelClasses,
  inputClasses,
  helperClasses,
} from './styles'

/**
 * Campo de texto controlado con soporte para variantes y tamaños.
 *
 * @param label Etiqueta del campo
 * @param helperText Texto auxiliar bajo el campo
 * @param inputSize Tamaño visual (`md` o `lg`)
 * @param variant Variante de estilo
 * @param disabled Deshabilitar el input
 * @param className Clases CSS adicionales
 */

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  inputSize = 'md',
  variant = 'default',
  disabled,
  className,
  ...props
}) => {
  const size = inputSize 
  const state = variant 
  const isDisabled = state === 'disabled' || disabled

  return (
    <div className={containerClasses()}>
      <label className={labelClasses()}>{label}</label>
      <input
        {...props}
        disabled={isDisabled}
        className={clsx(inputClasses(size, state), className)}
      />
      {helperText && (
        <span className={helperClasses(state)}>
          {helperText}
        </span>
      )}
    </div>
  )
}
