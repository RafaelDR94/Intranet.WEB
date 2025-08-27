import { InputSize } from "../Input/types";
/**
 * Variante visual del componente.
 */
export type Variant = "filled" | "outlined";

/**
 * Props del componente `Control`.
 */
export interface ControlProps {
  /** Acción al incrementar (`+`) */
  onIncrement: () => void | (() => void) | undefined;

  /** Acción al decrementar (`-`) */
  onDecrement: () => void | (() => void) | undefined;

  /** Estilo visual: `"filled"` (por defecto) o `"outlined"` */
  variant?: Variant;
  /** Deshabilita todo el componente */
  disable?: boolean;
  /** Deshabilita el boton de + */
  disablePlus?: boolean;
  /** Deshabilita el boton de - */
  disableMinus?: boolean;

  inputSize?: InputSize

  className?: string;
}
