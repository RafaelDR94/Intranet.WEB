import clsx from 'clsx'
import React, { useRef } from 'react'

import { useIndeterminate } from './hooks/useCheckbox'
import {
  baseLabel,
  layoutMap,
  checkboxClasses,
  indicatorClass,
  checkmarkClass,
  labelTextBase,
  labelTextDisabled,
} from './styles'
import { CheckboxProps } from './types'

/**
 * Casilla de verificación controlada que admite:
 * - Estado **indeterminado** (visual y accesible)
 * - Posición de etiqueta a la **izquierda** o **derecha**
 *
 * @remarks
 * - Es un **componente controlado**: debes pasar y actualizar `checked` desde el padre.
 * - El estado indeterminado en HTML no es un atributo, es una propiedad del DOM;
 *   por eso se aplica con el hook `useIndeterminate(inputRef, indeterminate)`.
 * - Para estilos, el wrapper expone `data-state="checked" | "unchecked" | "mixed"`.
 *
 * @accessibility
 * - Cuando `indeterminate` es true, el input añade `aria-checked="mixed"`.
 * - El `label` envuelve al `input`, por lo que el texto provee el **accessible name**.
 * - Usa `disabled` para desactivar interacción; los estilos del texto aplican opacidad.
 *
 * @example
 * ```tsx
 * const [agree, setAgree] = useState(false)
 *
 * <Checkbox
 *   checked={agree}
 *   onChange={setAgree}
 *   label="He leído y acepto los términos"
 * />
 * ```
 *
 * @example Indeterminado (por ejemplo, selección parcial)
 * ```tsx
 * <Checkbox
 *   checked={false}
 *   indeterminate
 *   onChange={() => { alternar selección }}
 *   label="Seleccionar todo"
 * />
 * ```
 */

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  label,
  labelPosition = 'right',
  name,
  className,
  dataTestId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  useIndeterminate(inputRef, indeterminate)

  // Extraemos la lógica de renderizado del indicador
  let indicatorElement: React.ReactNode
  if (indeterminate) {
    indicatorElement = <span className={clsx(indicatorClass)} />
  } else if (checked) {
    indicatorElement = (
      <svg
        className={clsx(checkmarkClass)}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M6.293 9.707a1 1 0 011.414 0L10 11.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    )
  } else {
    indicatorElement = null
  }

  return (
    <label
      data-testid={dataTestId}
      className={clsx(
        baseLabel,
        layoutMap[labelPosition],
        className,
      )}
    >
      <div className={checkboxClasses({ checked, indeterminate, disabled })}>
        {indicatorElement}
        <input
          ref={inputRef}
          type="checkbox"
          name={name}
          className="sr-only peer"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
        />
      </div>
      {label && (
        <span
          className={clsx(
            labelTextBase,
            disabled && labelTextDisabled
          )}
        >
          {label}
        </span>
      )}
    </label>
  )
}
