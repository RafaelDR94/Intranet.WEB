import { AlertType,AlertVariant } from "../types"
export interface useAlertProps {
  /** Tiempo en ms para cerrar automáticamente */
  autoCloseMs?: number
  /** Callback al cerrar (auto o manual futuro) */
  onClose?: () => void
    /** Tipo de alerta */
    type?: AlertType
    /** Variante de estilo */
    variant?: AlertVariant
    /** Título de la alerta */
    title: string
    /** Descripción de la alerta */
    description: string
}