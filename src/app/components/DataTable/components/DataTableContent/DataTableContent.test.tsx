import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import type { ColumnDefinition } from '../../types';

import DataTableContent from './DataTableContent';

vi.mock('@/app/components/Pagination/Pagination', () => ({
  default: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }) => (
    <button onClick={() => onPageChange(2)}>
      page:{currentPage}/{totalPages}
    </button>
  ),
}));
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg', () => ({ default: () => <span /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-up.svg', () => ({ default: () => <span /> }));
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

describe('DataTableContent', () => {
  it('renders provided rows', () => {
    render(<DataTableContent<Person> data={data} columns={columns} enablePagination={false} />);
    expect(screen.getByText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('calls onPageChange when pagination changes', () => {
    const onPageChange = vi.fn();
    render(
      <DataTableContent<Person>
        data={data}
        columns={columns}
        rowsPerPage={1}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByText('page:1/2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('keeps client pagination slicing local data', () => {
    render(
      <DataTableContent<Person>
        data={data}
        columns={columns}
        rowsPerPage={1}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull();
    expect(screen.getByText('page:1/2')).toBeInTheDocument();
  });

  it('renders server page rows without slicing them again', () => {
    const serverPage: Person[] = [
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'Delta' },
    ];

    render(
      <DataTableContent<Person>
        data={serverPage}
        columns={columns}
        rowsPerPage={2}
        paginationMode="server"
        currentPage={2}
        totalRows={4}
      />
    );

    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Delta')).toBeInTheDocument();
    expect(screen.getByText('page:2/2')).toBeInTheDocument();
  });

  it('aplica scroll interno cuando se define scrollMaxHeight', () => {
    const { container } = render(
      <DataTableContent<Person>
        data={data}
        columns={columns}
        enablePagination
        scrollMaxHeight={100}
      />
    );

    const scrollDiv = container.querySelector('div.overflow-y-auto');
    expect(scrollDiv).not.toBeNull();
    expect(scrollDiv).toHaveStyle({ maxHeight: '100px' });
  });
  it('no duplica filas al ordenar con IDs repetidos', () => {
    const duplicated: Person[] = [
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Charlie' },
    ];

    render(
      <DataTableContent<Person>
        data={duplicated}
        columns={columns}
        enablePagination={false}
      />
    );

    fireEvent.click(screen.getByText('NOMBRE'));

    const rows = screen.getAllByText(/Alice|Bob|Charlie/);
    expect(rows).toHaveLength(3);
  });
});

