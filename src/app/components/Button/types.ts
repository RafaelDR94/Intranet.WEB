import { SVGProps } from 'react';

/** 
 * Variantes visuales del botón.
 * - `solid`: Botón con fondo sólido
 * - `outline`: Borde visible, fondo transparente
 * - `ghost`: Sin borde ni fondo, solo texto e ícono
 */
export type Variant = 'solid' | 'outline' | 'ghost';

/**
 * Tamaños disponibles para el botón.
 * - `giant`: Extra grande
 * - `large`: Grande
 * - `medium`: Mediano (default)
 * - `small`: Pequeño
 * - `xsmall`: Extra pequeño
 */
export type Size = 'giant' | 'large' | 'medium' | 'small' | 'xsmall';

/**
 * Props del componente `Button`.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del botón (`solid`, `outline`, `ghost`) */
  variant?: Variant;

  /** Tamaño del botón (`giant`, `large`, `medium`, `small`, `xsmall`) */
  size?: Size;

  /** Dirección del ícono de flecha (`right`, `up` o `cancel`) */
  arrowDirection?: 'right' | 'up' | 'cancel';

  /** Si el botón debe mostrar solo ícono (sin texto) */
  iconOnly?: boolean;

  /** Si el botón está deshabilitado */
  disabled?: boolean;
    /** Icono custom: un componente SVG que recibe props SVGProps<SVGSVGElement> */
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  /** Esconde el icono */
   hideIcon?: boolean;
}
