/**
 * Props para el componente ProgressBar.
 */
export type ProgressBarProps = {
  /** Valor actual de progreso entre 0 y 100 */
  value: number;

  /** Etiqueta opcional a mostrar (por defecto, `${value}%`) */
  label?: string;

  /** Indica si se debe mostrar el porcentaje (true por defecto) */
  showPercentage?: boolean;
};
