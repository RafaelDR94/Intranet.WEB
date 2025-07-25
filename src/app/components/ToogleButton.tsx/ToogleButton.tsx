// src/app/components/ToggleButton/ToggleButton.tsx

'use client'

import React from 'react'
import clsx from 'clsx'
import {
  ToggleButtonProps,
} from './types'
import * as styles from './styles'

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  labelPosition = 'right',
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
      className={clsx(
        styles.containerBase,
        labelPosition === 'left' && styles.containerReverse,
        disabled ? styles.containerDisabled : styles.containerPointer
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
      {label && <span className={styles.labelBase}>{label}</span>}
    </label>
  )
}
