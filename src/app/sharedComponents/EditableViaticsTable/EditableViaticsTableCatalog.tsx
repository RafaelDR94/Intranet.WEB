'use client';

import { useState } from 'react';

import { EditableViaticsTable } from './EditableViaticsTable';
import { EditableViaticsRow } from './types';
import { mockViaticsRows } from './utilities/mockRows';

export default function EditableViaticsTableCatalog() {
  const [rows, setRows] = useState<EditableViaticsRow[]>(mockViaticsRows);

  return (
    <div className="p-2" data-theme="light">
      <EditableViaticsTable value={rows} onChange={setRows} />
    </div>
  );
}
