export type LabelMode = "number" | "fraction";

export type ControlLevelProps = {
  title?: string;

  /** Mostrar/ocultar los subcomponentes */
  showSemicircle?: boolean;
  showLinear?: boolean;

  /** Escala */
  min?: number;         // valor mínimo (default 0)
  max?: number;         // valor máximo (default 1)
  divisions?: number;   // en cuántas partes se divide el rango (default 4 => cuartos)

  /** Formato de etiquetas y valor central */
  labelMode?: LabelMode; // "number" | "fraction" (default "fraction")
  decimals?: number;     // si labelMode = "number", cuántos decimales (default 2)

  /** Control externo opcional (si lo pasas, el componente se vuelve controlado) */
  level?: number;
  setLevel?: (v: number) => void;

  /** Valor inicial para el modo no controlado */
  initialValue?: number;

  /** Notificación de cambios */
  onChange?: (v: number) => void;

  /** Estilos opcionales */
  className?: string;
};
