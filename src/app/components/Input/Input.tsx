'use client';

import React from 'react';
import clsx from 'clsx';

type InputSize = 'md' | 'lg';
type InputVariant = 'default' | 'filled' | 'disabled' | 'success' | 'info' | 'warning' | 'error';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  inputSize?: InputSize;
  variant?: InputVariant;
}

const baseStyles = {
  container: 'flex flex-col gap-1 group',
  label: 'text-label font-medium text-black-100',
  helper: 'text-c2',
  input: 'rounded-md border px-3 outline-none transition-all w-full',
  sizes: {
    md: 'text-sm py-2',
    lg: 'text-base py-3',
  },
  variants: {
    default: 'border-gray-30  text-black-100 placeholder-gray-60',
    filled: 'border-gray-30  text-black-100 placeholder-black-100',
    disabled: 'bg-gray-20 border-gray-20 text-gray-50 placeholder-gray-50 cursor-not-allowed',
    success: 'border-alert-green-100 text-black-100 placeholder-black-100',
    info: 'border-alert-blue-100 text-black-100 placeholder-black-100',
    warning: 'border-alert-yellow-100 text-black-100 placeholder-black-100',
    error: 'border-alert-red-100 text-black-100 placeholder-black-100',
  },
  helperColors: {
    default: 'text-gray-60',
    success: 'text-alert-green-100',
    info: 'text-alert-blue-100',
    warning: 'text-alert-yellow-100',
    error: 'text-alert-red-100',
  },
};

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  inputSize = 'md',
  variant = 'default',
  disabled,
  className,
  ...props
}) => {
  const isDisabled = variant === 'disabled' || disabled;
  const helperClass =
    baseStyles.helperColors[variant as keyof typeof baseStyles.helperColors] ??
    baseStyles.helperColors.default;

  return (
    <div className={baseStyles.container}>
      <label className={baseStyles.label}>{label}</label>
      <input
        disabled={isDisabled}
        className={clsx(
          baseStyles.input,
          baseStyles.sizes[inputSize],
          baseStyles.variants[variant],
          'hover:border-green-80 focus:border-green-100 focus:bg-green-10',
          className
        )}
        placeholder={props.placeholder}
        {...props}
      />
      {helperText && <span className={clsx(baseStyles.helper, helperClass)}>{helperText}</span>}
    </div>
  );
};
