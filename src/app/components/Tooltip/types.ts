/**
 * Posiciones válidas del tooltip.
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props del componente `Tooltip`.
 */
export interface TooltipProps {
  /** Elemento sobre el que se mostrará el tooltip */
  children: React.ReactNode;

  /** Texto a mostrar dentro del tooltip */
  text: string;

  /** Posición del tooltip respecto al elemento hijo (por defecto: "top") */
  position?: TooltipPosition;
}
