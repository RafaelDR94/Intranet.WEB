'use client'

import React from 'react';
import clsx from 'clsx';
import { InputProps } from './types';
import {
  containerClasses,
  labelClasses,
  inputClasses,
  helperClasses,
  eyesicontyles,
  textareaClasses,
} from './styles';
import EyeIcon from '@/assets/icons/acciones/eye-alt.svg';
import EyeOffIcon from '@/assets/icons/acciones/eye-close.svg';
import useInput from './hooks/useInput';

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
    <div className={containerClasses()}>
      {label && <label className={labelClasses()}>{label}</label>}

      <div className="relative">
        {isTextarea ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={rows}
            disabled={isDisabled}
            className={clsx(textareaClasses(size, state), className)}
            aria-multiline="true"
          />
        ) : (
          <>
            <input
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
              type={isPassword && showPassword ? 'text' : (type as string)}
              disabled={isDisabled}
              className={clsx(inputClasses(size, state), className)}
            />

            {Icon && (
              <button
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

      {helperText && <span className={helperClasses(state)}>{helperText}</span>}
    </div>
  );
};
