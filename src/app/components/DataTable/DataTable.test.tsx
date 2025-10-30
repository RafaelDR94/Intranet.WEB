import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect , vi } from 'vitest';

import { DataTable } from './DataTable';
import type { ColumnDefinition, DataTableProps } from './types';


vi.mock('@/assets/icons/System/System/calendar.svg', () => ({ default: () => <span /> }));
vi.mock('@/assets/icons/organization/filter-alt.svg', () => ({ default: () => <span /> }));
vi.mock('@/assets/icons/organization/search.svg', () => ({ default: () => <span /> }));
vi.mock('@/assets/icons/organization/chevron-down.svg', () => ({ default: () => <span /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg', () => ({ default: () => <span /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-up.svg', () => ({ default: () => <span /> }));
vi.mock('@/app/components/Calendar/Calendar', () => ({ Calendar: () => <span /> }));

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

const setup = (overrideProps?: Partial<DataTableProps<Person>>) => {
  const props: DataTableProps<Person> = {
    tables: [
      {
        title: 'Usuarios',
        columns,
        data,
      },
    ],
    ...overrideProps,
  };
  return render(<DataTable<Person> {...props} />);
};

describe('DataTable', () => {
  it('muestra las filas proporcionadas', () => {
    setup();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('filtra las filas mediante la búsqueda interna', () => {
    setup();
    const input = screen.getByPlaceholderText('Buscar');
    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull();
  });
});
