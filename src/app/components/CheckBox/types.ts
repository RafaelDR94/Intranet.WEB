export type LabelPosition = 'left' | 'right'

export interface CheckboxProps {
  /** Estado marcado */
  checked: boolean
  /** Callback al cambiar */
  onChange: (checked: boolean) => void
  /** Estado indeterminado */
  indeterminate?: boolean
  /** Deshabilitado */
  disabled?: boolean
  /** Texto de etiqueta */
  label?: string
  /** Posición de la etiqueta */
  labelPosition?: LabelPosition
  /** Nombre del input */
  name?: string
}