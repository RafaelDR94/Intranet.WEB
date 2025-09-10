/**
 * Tipos posibles de tamaño para el Spinner.
 */
export type SpinnerSize = 'giant' | 'large' | 'medium' | 'small' | 'tiny';

/** Props del componente `Spinner`. */
export interface SpinnerProps {
  /** Tamaño del spinner */
  size?: SpinnerSize;
  /** Identificador de pruebas */
  dataTestId?: string;
}