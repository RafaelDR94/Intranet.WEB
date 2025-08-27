// src/app/components/NumberControl/NumberControl.tsx
'use client';

import React from 'react';
import clsx from 'clsx';
import { Control } from '@/app/components/Control/Control';
import { numberControlStyles as s } from './styles';
import { NumberControlProps } from './types';
import { useNumberControl } from './hooks/useNumberControl';

export const NumberControl: React.FC<NumberControlProps> = ({
  value,
  onChange,
  defaultValue = 0,
  min,
  max,
  step = 1,
  size = 'md',
  variant = 'default',
  disabled = false,
  label,
  helperText ,
  className,
  inputAriaLabel = 'Valor numérico',
  clampOnBlur = true,
}) => {
  const {
    inputRef,
    editing,
    incDisabled,
    decDisabled,
    handleIncrement,
    handleDecrement,
    handleInputChange,
    handleInputBlur,
  } = useNumberControl({
    value,
    onChange,
    defaultValue,
    min,
    max,
    step,
    disabled,
    clampOnBlur,
  });

  const currentVariant = disabled ? 'disabled' : variant;

  const inputClasses = clsx(
    s.inputBase,
    s.sizes[size],
    s.variants[currentVariant as keyof typeof s.variants],
    !disabled && s.hover
  );

  const helperClass =
    s.helperColors[
      (disabled ? 'default' : (variant as keyof typeof s.helperColors)) ?? 'default'
    ] ?? s.helperColors.default;

  return (
    <div className={clsx(s.container, className)}>
      {label && <label className={s.label}>{label}</label>}

      <div className={s.row}>
        <div className={s.controlWrap} aria-label="Controles de incremento">
          <Control
            inputSize={size}
            disable={disabled}
            disablePlus={incDisabled}
            disableMinus={decDisabled}
            // No pases handlers cuando el botón esté deshabilitado:
            onIncrement={incDisabled ? ()=>{}: handleIncrement}
            onDecrement={decDisabled ? ()=>{} : handleDecrement}
          />
        </div>

        <input
          ref={inputRef}
          inputMode="numeric"
          aria-label={inputAriaLabel}
          className={inputClasses}
          value={editing}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
        />
      </div>

      {helperText && <span className={clsx(s.helper, helperClass)}>{helperText}</span>}
    </div>
  );
};

export default NumberControl;
