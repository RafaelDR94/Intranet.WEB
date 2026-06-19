import { EditableViaticsRow } from '../types';

export const parseAmount = (value: string): number => {
  const normalized = value.replace(/,/g, '').trim();
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
};

export const formatIntegerAmount = (value: number): string => {
  return new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(value);
};

export const calculateSubtotal = (rows: EditableViaticsRow[]): number => {
  return rows.reduce((acc, row) => acc + parseAmount(row.subtotal), 0);
};
