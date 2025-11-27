/**
 * Tipos de alerta disponibles.
 * - `default`: Estado neutro
 * - `success`: Operación exitosa
 * - `info`: Información adicional
 * - `warning`: Advertencia al usuario
 * - `error`: Operación fallida
 */
export type AlertType =
  | 'default'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'notification';

/**
 * Variantes de estilo de la alerta.
 * - `filled`: Fondo sólido y texto claro
 * - `subtle`: Fondo claro y borde
 */
export type AlertVariant = 'filled' | 'subtle';

/** Props del componente `Alert`. */
export interface AlertProps {
  /** Tipo de alerta */
  type?: AlertType;
  /** Variante de estilo */
  variant?: AlertVariant;
  /** Título de la alerta */
  title: string;
  /** Descripción de la alerta */
  description: string;
  /** Mostrar botón primario */
  showPrimaryButton?: boolean;
  /** Mostrar botón secundario */
  showSecondaryButton?: boolean;
  /** Callback de clic primario */
  onPrimaryClick?: () => void;
  /** Callback de clic secundario */
  onSecondaryClick?: () => void;
  /** Etiqueta del botón primario */
  primaryLabel?: string;
  /** Etiqueta del botón secundario */
  secondaryLabel?: string;
  /** Tiempo en ms para cerrar automáticamente */
  autoCloseMs?: number;
  /** Callback al cerrar (auto o manual, incluyendo clic) */
  onClose?: () => void;
  /** Si es true, cerrar al hacer clic en cualquier parte de la alerta */
  closeOnClick?: boolean;
}

