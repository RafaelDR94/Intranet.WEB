// src/app/components/NumberControl/types.ts
export type NumberControlSize = 'sm' | 'md' | 'lg';
export type NumberControlVariant =
  | 'default'
  | 'filled'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'disabled';

export interface NumberControlProps {
  /** Controlado: valor numérico */
  value?: number;
  /** Notificación cuando cambia el valor (controlado o no controlado) */
  onChange?: (next: number) => void;
  /** No controlado: valor inicial */
  defaultValue?: number;

  /** Límites opcionales */
  min?: number;
  max?: number;
  /** Paso de incremento/decremento */
  step?: number;

  /** Tamaño visual (alineado a Input y Control) */
  size?: NumberControlSize;
  /** Variante visual del input */
  variant?: NumberControlVariant;
  /** Deshabilita todo el componente */
  disabled?: boolean;

  /** UI */
  label?: string;
  helperText?: string;
  className?: string;
  inputAriaLabel?: string;

  /**
   * Si es true, al perder foco se clampa el texto al rango [min,max].
   * Si es false, solo se normaliza si es número.
   */
  clampOnBlur?: boolean;
}
