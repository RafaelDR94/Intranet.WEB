/**
 * Tipos de alerta disponibles.
 * - `default`: Estado neutro
 * - `success`: Operacion exitosa
 * - `info`: Informacion adicional
 * - `warning`: Advertencia al usuario
 * - `error`: Operacion fallida
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
 * - `filled`: Fondo solido y texto claro
 * - `subtle`: Fondo claro y borde
 */
export type AlertVariant = 'filled' | 'subtle';

/** Props del componente `Alert`. */
export interface AlertProps {
  /** Tipo de alerta */
  type?: AlertType;
  /** Variante de estilo */
  variant?: AlertVariant;
  /** Titulo de la alerta */
  title: string;
  /** Descripcion de la alerta */
  description: string;
  /** Fecha de creacion/recepcion (para notificaciones) */
  createdAt?: string;
  /** Imagen para avatar (notificaciones) */
  avatarSrc?: string;
  /** Mostrar boton primario */
  showPrimaryButton?: boolean;
  /** Mostrar boton secundario */
  showSecondaryButton?: boolean;
  /** Callback de clic primario */
  onPrimaryClick?: () => void;
  /** Callback de clic secundario */
  onSecondaryClick?: () => void;
  /** Etiqueta del boton primario */
  primaryLabel?: string;
  /** Etiqueta del boton secundario */
  secondaryLabel?: string;
  /** Tiempo en ms para cerrar automaticamente */
  autoCloseMs?: number;
  /** Callback al cerrar (auto o manual, incluyendo clic) */
  onClose?: () => void;
  /** Si es true, cerrar al hacer clic en cualquier parte de la alerta */
  closeOnClick?: boolean;
}
