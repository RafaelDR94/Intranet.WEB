/**
 * Variante visual del componente.
 */
export type Variant = "filled" | "outlined";

/**
 * Props del componente `Control`.
 */
export interface ControlProps {
  /** Valor actual (no visible) */
  value?: number;

  /** Acción al incrementar (`+`) */
  onIncrement: () => void;

  /** Acción al decrementar (`-`) */
  onDecrement: () => void;

  /** Estilo visual: `"filled"` (por defecto) o `"outlined"` */
  variant?: Variant;
}
