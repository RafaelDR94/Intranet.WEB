import { useMemo, useState } from 'react';

import { EditableViaticsRow } from '../types';
import { calculateSubtotal } from '../utilities/helperFunction';

interface UseEditableViaticsTableParams {
  value?: EditableViaticsRow[];
  defaultValue?: EditableViaticsRow[];
  onChange?: (rows: EditableViaticsRow[]) => void;
}

export const useEditableViaticsTable = ({ value, defaultValue = [], onChange }: UseEditableViaticsTableParams) => {
  const [internalRows, setInternalRows] = useState<EditableViaticsRow[]>(defaultValue);
  const rows = value ?? internalRows;
  const subtotal = useMemo(() => calculateSubtotal(rows), [rows]);

  const updateRows = (nextRows: EditableViaticsRow[]) => {
    if (!value) setInternalRows(nextRows);
    onChange?.(nextRows);
  };

  return { rows, subtotal, updateRows };
};
