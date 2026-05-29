/**
 * Fila editable para la tabla de viáticos.
 */
export interface EditableViaticsRow {
  id: string;
  concept: string;
  nationalQuoted: string;
  foreignQuoted: string;
  people: string;
  days: string;
  subtotal: string;
  observations: string;
}

export interface EditableViaticsTableLabels {
  concept: string;
  perDiem: string;
  nationalQuoted: string;
  foreignQuoted: string;
  people: string;
  days: string;
  subtotal: string;
  observations: string;
  subtotalSummary: string;
  total: string;
  includesTax: string;
  note: string;
}

export interface EditableViaticsTableProps {
  value?: EditableViaticsRow[];
  defaultValue?: EditableViaticsRow[];
  onChange?: (rows: EditableViaticsRow[]) => void;
  onBlurCell?: (rowId: string, field: keyof Omit<EditableViaticsRow, 'id'>, value: string) => void;
  labels?: Partial<EditableViaticsTableLabels>;
  totalOverride?: string;
  readOnly?: boolean;
  /** Activa el cálculo automático de subtotal por fila y total general. */
  autoCalculate?: boolean;
  /** Permite inyectar una fórmula custom para calcular el subtotal de cada fila. */
  rowSubtotalCalculator?: (row: EditableViaticsRow) => number;
  className?: string;
  dataTestId?: string;
}
