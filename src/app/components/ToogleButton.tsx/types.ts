/** Posiciones válidas para la etiqueta del toggle. */
export type LabelPosition = 'left' | 'right'

/** Props del componente `ToggleButton`. */
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
  /**Color de la etuqueta */
  labelColor?:string;
}

