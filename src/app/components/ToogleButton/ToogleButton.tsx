// src/app/components/ToggleButton/ToggleButton.tsx

'use client'

import clsx from 'clsx'
import React from 'react'

import * as styles from './styles'
import {
  ToggleButtonProps,
} from './types'

/**
 * Botón tipo **interruptor** para alternar un valor booleano.
 *
 * Renderiza un control con “track + thumb” y una etiqueta opcional a izquierda/derecha.
 * Es un componente **controlado**: el estado visible depende de `checked`, y los cambios
 * se notifican a través de `onChange(checked)`.
 *
 * @remarks
 * - Usa un `<input type="checkbox" className="sr-only">` para mantener accesibilidad nativa.
 * - El color/estilo del “track” se calcula según `checked` y `disabled`.
 * - `labelColor` acepta una clase utilitaria (p. ej. tokens Tailwind).
 *
 * @accessibility
 * - El input expone `role="switch"` y `aria-checked`.
 * - Como el `<input>` está envuelto en `<label>`, la relación etiqueta-control es implícita.
 *   Si no pasas `label`, considera envolver el componente con un `aria-label` contextual.
 *
 * @example
 * ```tsx
 * <ToggleButton
 *   checked={enabled}
 *   onChange={setEnabled}
 *   label="Notificaciones"
 * />
 * ```
 *
 * @example Etiqueta a la izquierda
 * ```tsx
 * <ToggleButton
 *   checked={darkMode}
 *   onChange={setDarkMode}
 *   label="Modo oscuro"
 *   labelPosition="left"
 * />
 * ```
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  labelPosition = 'right',
  labelColor,
  className,
  dataTestId,
}) => {
  // Extraemos la lógica anidada en un bloque if/else
  let trackStyle: string
  if (disabled) {
    trackStyle = styles.trackDisabled
  } else if (checked) {
    trackStyle = styles.trackChecked
  } else {
    trackStyle = styles.trackUnchecked
  }

    return (
      <label
        data-testid={dataTestId}
        className={clsx(
          styles.containerBase,
          labelPosition === 'left' && styles.containerReverse,
          disabled ? styles.containerDisabled : styles.containerPointer,
          className
        )}
      >
      <div
        className={clsx(
          styles.trackBase,
          trackStyle
        )}
      >
        <span
          className={clsx(
            styles.thumbBase,
            checked ? styles.thumbChecked : styles.thumbUnchecked
          )}
        />
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            if (disabled) return
            onChange(e.target.checked)
          }}
        />
      </div>
      {label && <span className={labelColor??styles.labelBase}>{label}</span>}
    </label>
  )
}
