'use client';

import DataTableContent from './DataTableContent';
import type { ColumnDefinition } from '../../types';

interface Person {
  id: number;
  name: string;
}

const columns: ColumnDefinition<Person>[] = [
  { key: 'name', label: 'Nombre' },
];

const data: Person[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

export default function DataTableContentCatalog() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-h3 font-display">DataTableContent</h2>
      <DataTableContent<Person> data={data} columns={columns} />
    </div>
  );
}
