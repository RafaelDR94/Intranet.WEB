/**
 * Fila editable para la tabla de viáticos.
 */
export interface EditableViaticsRow {
  id: string;
  calculationId?: string;
  employeeId?: string;
  concept: string;
  nationalQuoted: string;
  foreignQuoted: string;
  people: string;
  days: string;
  subtotal: string;
  observations: string;
}

export type EditableViaticsField =
  | 'nationalQuoted'
  | 'foreignQuoted'
  | 'people'
  | 'days'
  | 'subtotal'
  | 'observations';

export type EditableViaticsColumnField = 'concept' | EditableViaticsField;

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
  addConcept: string;
  newConceptPlaceholder: string;
}

export interface EditableViaticsTableProps {
  value?: EditableViaticsRow[];
  defaultValue?: EditableViaticsRow[];
  onChange?: (rows: EditableViaticsRow[]) => void;
  onBlurCell?: (rowId: string, field: EditableViaticsField, value: string) => void;
  labels?: Partial<EditableViaticsTableLabels>;
  totalOverride?: string;
  readOnly?: boolean;
  /** Activa el cálculo automático de subtotal por fila y total general. */
  autoCalculate?: boolean;
  /** Permite inyectar una fórmula custom para calcular el subtotal de cada fila. */
  rowSubtotalCalculator?: (row: EditableViaticsRow) => number;
  /** Permite agregar conceptos personalizados al final de la tabla. */
  allowAddConcept?: boolean;
  className?: string;
  dataTestId?: string;
}
