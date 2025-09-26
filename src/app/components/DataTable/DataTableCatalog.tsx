'use client';

import { useState } from 'react';

import { DataTable } from './DataTable';
import type { ColumnDefinition } from './types';

interface Person {
  id: number;
  name: string;
  role: string;
}

export default function DataTableCatalog() {
  const columns: ColumnDefinition<Person>[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'role', label: 'Rol' },
  ];

  const [data] = useState<Person[]>([
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' },
    { id: 3, name: 'Charlie', role: 'Editor' },
  ]);

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-h3 font-display">DataTable</h2>
      <DataTable<Person>
        tables={[
          {
            title: 'Usuarios',
            columns,
            data,
            enableSelection: true,
          },
        ]}
      />
    </div>
  );
}
