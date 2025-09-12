'use client'

import clsx from 'clsx';
import React from 'react';

import useInput from './hooks/useInput'
import {
  containerClasses,
  labelClasses,
  inputClasses,
  helperClasses,
  textareaClasses,
  eyesicontyles
} from './styles'
import { InputProps } from './types';

import EyeIcon from '@/assets/icons/acciones/eye-alt.svg'
import EyeOffIcon from '@/assets/icons/acciones/eye-close.svg'


/**
 * Campo de texto **controlado** con soporte de variantes visuales, tamaños y modo multilinea.
 *
 * @remarks
 * - Soporta dos modos mediante `as`: `<input>` (por defecto) o `<textarea>`.
 * - Para `type="password"` muestra un **toggle de visibilidad** (ojo) integrado.
 * - El ícono recibido por `icon` se renderiza al extremo derecho (accionable con `onIconClick`).
 * - El estado deshabilitado se respeta tanto por `variant="disabled"` como por `disabled={true}`.
 *
 * @accessibility
 * - Si proporcionas `label`, se renderiza encima del control. Para asociarlo de forma
 *   explícita con el input, añade un `id` al control y `htmlFor` en el label (o envuelve
 *   el input con `<label>`).
 * - El helper text se anuncia como texto auxiliar; si es crítico, considera `aria-describedby`.
 * - Los botones de ícono usan `tabIndex={-1}` (no enfocables). Si necesitas control por
 *   teclado, quita ese `tabIndex` y añade `aria-label`.
 *
 * @example Input simple
 * ```tsx
 * <Input
 *   label="Nombre"
 *   placeholder="Tu nombre"
 *   value={name}
 *   onChange={(e) => setName(e.target.value)}
 * />
 * ```
 *
 * @example Contraseña con toggle
 * ```tsx
 * <Input
 *   label="Contraseña"
 *   type="password"
 *   helperText="Mínimo 8 caracteres"
 *   value={pwd}
 *   onChange={(e) => setPwd(e.target.value)}
 * />
 * ```
 *
 * @example Multilínea
 * ```tsx
 * <Input
 *   as="textarea"
 *   label="Descripción"
 *   rows={6}
 *   value={bio}
 *   onChange={(e) => setBio(e.target.value)}
 * />
 * ```
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
  as = 'input',
  rows = 4,
  dataTestId,
  ...props
}) => {
  const size = inputSize;
  const state = variant;
  const isDisabled = state === 'disabled' || disabled;
  const isTextarea = as === 'textarea';

  // Soporte de password/eye sólo para <input>
  const { isPassword, showPassword, setShowPassword } = useInput(isTextarea ? 'text' : type as string);
  const Icon = icon;

  return (
    <div className={containerClasses()}  data-testid={`${dataTestId}-container`}>
      {label && <label className={labelClasses()}>{label}</label>}

      <div className="relative mb-2">
        {isTextarea ? (
          <textarea
            data-testid={dataTestId}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={rows}
            disabled={isDisabled}
            className={clsx(textareaClasses(size, state), className)}
            aria-multiline="true"
          />
        ) : (
          <>
            <input
              data-testid={dataTestId}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
              type={isPassword && showPassword ? 'text' : (type as string)}
              disabled={isDisabled}
              className={clsx(inputClasses(size, state), className)}
            />

            {Icon && (
              <button
                data-testid={`${dataTestId}-icon`}
                type="button"
                onClick={onIconClick}
                className={eyesicontyles.eyeButton}
                tabIndex={-1}
              >
                <Icon className={eyesicontyles.eyeIcon} />
              </button>
            )}

            {isPassword && (
              <button
                data-testid={`${dataTestId}-icon`}
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
          </>
        )}
      </div>

      {helperText && <span  data-testid={`${dataTestId}-helpertext`} className={helperClasses(state)}>{helperText}</span>}
    </div>
  );
};
