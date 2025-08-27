export interface UseNumberControlArgs {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  clampOnBlur?: boolean;
  onChange?: (next: number) => void;
}

export interface UseNumberControlReturn {
  /** valor numérico “vivo” (controlado o interno) */
  liveValue: number;
  /** texto que se muestra en el input mientras se edita */
  editing: string;
  /** ref del input para usos externos si se requiere (focus, selección, etc.) */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** deshabilita “-” si alcanzaría min o está disabled */
  decDisabled: boolean;
  /** deshabilita “+” si alcanzaría max o está disabled */
  incDisabled: boolean;
  /** incrementa (si no está deshabilitado) */
  handleIncrement: () => void;
  /** decrementa (si no está deshabilitado) */
  handleDecrement: () => void;
  /** actualiza el texto del input en edición */
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  /** valida/normaliza al perder foco */
  handleInputBlur: React.FocusEventHandler<HTMLInputElement>;
}
