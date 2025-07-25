export type AlertType = 'default' | 'success' | 'info' | 'warning' | 'error'
export type AlertVariant = 'filled' | 'subtle'

export interface AlertProps {
  /** Tipo de alerta */
  type?: AlertType
  /** Variante de estilo */
  variant?: AlertVariant
  /** Título de la alerta */
  title: string
  /** Descripción de la alerta */
  description: string
  /** Mostrar botón primario */
  showPrimaryButton?: boolean
  /** Mostrar botón secundario */
  showSecondaryButton?: boolean
  /** Callback de clic primario */
  onPrimaryClick?: () => void
  /** Callback de clic secundario */
  onSecondaryClick?: () => void
  /** Etiqueta del botón primario */
  primaryLabel?: string
  /** Etiqueta del botón secundario */
  secondaryLabel?: string
}