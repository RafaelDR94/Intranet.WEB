/** Posición de la etiqueta respecto a la casilla */
export type LabelPosition = 'left' | 'right'

/** Props del componente `Checkbox`. */
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
  /** Clases CSS adicionales para personalizar el contenedor */
  className?: string
  /** Identificador de pruebas */
  dataTestId?: string
}
