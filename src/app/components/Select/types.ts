// src/app/components/Select/types.ts

/** Opción disponible para el select. */
export type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

/** Tamaños permitidos para el select. */
export type SelectSize = 'md' | 'lg'

/** Variantes visuales del select. */
export type SelectVariant =
  | 'default'
  | 'filled'
  | 'disabled'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'

/** Props del componente `Select`. */
export interface SelectProps {
  options: SelectOption[]
  placeholder?: string
  multiple?: boolean
  selected: string[]
  onChange: (values: string[]) => void
  size?: SelectSize
  variant?: SelectVariant
  label?: string
  helperText?: string
  disabled?: boolean
  className?: string
}

