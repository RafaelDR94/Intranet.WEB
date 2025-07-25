// src/app/components/Select/types.ts

export type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

export type SelectSize = 'md' | 'lg'

export type SelectVariant =
  | 'default'
  | 'filled'
  | 'disabled'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'

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
}
