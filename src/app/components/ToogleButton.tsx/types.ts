export type LabelPosition = 'left' | 'right'

export interface ToggleButtonProps {
  /** Estado del toggle */
  checked: boolean
  /** Callback cuando cambia */
  onChange: (checked: boolean) => void
  /** Deshabilita la interacción */
  disabled?: boolean
  /** Texto de etiqueta opcional */
  label?: string
  /** Posición de la etiqueta */
  labelPosition?: LabelPosition
}
