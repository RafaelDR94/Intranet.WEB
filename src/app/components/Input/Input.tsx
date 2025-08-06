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
  eyesicontyles
} from './styles'
import EyeIcon from '@/assets/icons/acciones/eye-alt.svg'
import EyeOffIcon from '@/assets/icons/acciones/eye-close.svg'
import useInput from './hooks/useInput'

/**
 * Campo de texto controlado con soporte para variantes y tamaños.
 *
 * @param label Etiqueta del campo
 * @param helperText Texto auxiliar bajo el campo
 * @param inputSize Tamaño visual (`md` o `lg`)
 * @param variant Variante de estilo
 * @param disabled Deshabilitar el input
 * @param className Clases CSS adicionales
 * @param icon Icono para renderizar dentro del input
 * @param onIconClick Accion tras presionar el icono enviado
 */

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  inputSize = 'md',
  variant = 'default',
  disabled,
  className,
  type = 'text',
  icon,
  onIconClick,
  ...props
}) => {
  const size = inputSize
  const state = variant
  const isDisabled = state === 'disabled' || disabled
  const { isPassword, showPassword, setShowPassword } = useInput(type);
  const Icon = icon;
  return (
    <div className={containerClasses()}>
      <label className={labelClasses()}>{label}</label>

      <div className="relative">
        <input
          {...props}
          type={isPassword && showPassword ? 'text' : type}
          disabled={isDisabled}
          className={clsx(
            inputClasses(size, state),
            className,
          )}
        />

        {icon &&
          <button
            type="button"
            onClick={onIconClick}
            className={eyesicontyles.eyeButton}
            tabIndex={-1}
          >
            <Icon className={eyesicontyles.eyeIcon} />
          </button>
        }


        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={eyesicontyles.eyeButton}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeIcon className={eyesicontyles.eyeIcon} />

            ) : (
              <EyeOffIcon className={eyesicontyles.eyeIcon} />
            )}
          </button>
        )}
      </div>

      {helperText && (
        <span className={helperClasses(state)}>
          {helperText}
        </span>
      )}
    </div>
  )
}
