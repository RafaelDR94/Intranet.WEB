import React, { useRef } from 'react'
import clsx from 'clsx'
import { CheckboxProps } from './types'
import {
  baseLabel,
  layoutMap,
  checkboxClasses,
  indicatorClass,
  checkmarkClass,
  labelTextBase,
  labelTextDisabled,
} from './styles'
import { useIndeterminate } from './hooks/useCheckbox'

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  label,
  labelPosition = 'right',
  name,
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
      className={clsx(
        baseLabel,
        layoutMap[labelPosition],
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
