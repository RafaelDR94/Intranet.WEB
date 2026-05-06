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
  containerClassName,
  labelClassName,
  helperClassName,
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
  const containerTestIdProps = dataTestId ? { 'data-testid': `${dataTestId}-container` } : {};
  const controlTestIdProps = dataTestId ? { 'data-testid': dataTestId } : {};
  const iconTestIdProps = dataTestId ? { 'data-testid': `${dataTestId}-icon` } : {};
  const helperTestIdProps = dataTestId ? { 'data-testid': `${dataTestId}-helpertext` } : {};

  // Soporte de password/eye sólo para <input>
  const { isPassword, showPassword, setShowPassword } = useInput(isTextarea ? 'text' : type as string);
  const Icon = icon;

  return (
    <div className={clsx(containerClasses(), containerClassName)} {...containerTestIdProps}>
      {label && <label className={clsx(labelClasses(), labelClassName)}>{label}</label>}

      <div className="relative mb-0">
        {isTextarea ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            {...controlTestIdProps}
            rows={rows}
            disabled={isDisabled}
            className={clsx(textareaClasses(size, state), className)}
            aria-multiline="true"
          />
        ) : (
          <>
            <input
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
              {...controlTestIdProps}
              type={isPassword && showPassword ? 'text' : (type as string)}
              disabled={isDisabled}
              className={clsx(inputClasses(size, state), className)}
            />

            {Icon && (
              <button
                {...iconTestIdProps}
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
                {...iconTestIdProps}
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

      {helperText && (
        <span {...helperTestIdProps} className={clsx(helperClasses(state), helperClassName)}>
          {helperText}
        </span>
      )}
    </div>
  );
};
