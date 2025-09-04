// src/app/components/NumberControl/NumberControl.tsx
'use client';

import React from 'react';
import clsx from 'clsx';
import { Control } from '@/app/components/Control/Control';
import { numberControlStyles as s } from './styles';
import { NumberControlProps } from './types';
import { useNumberControl } from './hooks/useNumberControl';
/**
 * Campo numérico con **botones de incremento/decremento** y entrada de texto.
 *
 * Puede funcionar en modo **controlado** (`value` + `onChange`) o **no controlado**
 * (`defaultValue`). Opcionalmente, restringe el valor dentro de `[min, max]` y
 * aplica normalización al perder foco vía `clampOnBlur`.
 *
 * @remarks
 * - El hook `useNumberControl` coordina la edición en texto, los límites
 *   (`min`/`max`), el paso (`step`) y el estado de los botones.
 * - En modo controlado, el valor visible depende del padre: recuerda actualizar
 *   el estado en `onChange`.
 * - En modo no controlado, `defaultValue` es el punto de partida interno.
 * - Los botones no llaman handlers cuando están deshabilitados (defensa adicional).
 *
 * @accessibility
 * - El input usa `inputMode="numeric"` para facilitar teclados numéricos en móvil.
 * - Personaliza `inputAriaLabel` si el contexto requiere más detalle.
 * - Los botones de `Control` deben tener `aria-label` adecuados (el componente ya
 *   gestiona su accesibilidad; aquí solo se pasan handlers).
 *
 * @example No controlado (simple)
 * ```tsx
 * <NumberControl defaultValue={1} min={0} max={10} />
 * ```
 *
 * @example Controlado
 * ```tsx
 * const [qty, setQty] = useState(2);
 * <NumberControl value={qty} onChange={setQty} min={1} step={0.5} />
 * ```
 *
 * @example Con helper y variante
 * ```tsx
 * <NumberControl
 *   defaultValue={0}
 *   min={0}
 *   max={100}
 *   variant="warning"
 *   helperText="Ingresa un valor entre 0 y 100"
 * />
 * ```
 */
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
