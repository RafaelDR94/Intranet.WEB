import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DataTableContent from './DataTableContent';
import type { ColumnDefinition } from '../../types';

vi.mock('@/app/components/Pagination/Pagination', () => ({
  default: ({ onPageChange }: { onPageChange: (page: number) => void }) => (
    <button onClick={() => onPageChange(2)}>next</button>
  ),
}));

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
    fireEvent.click(screen.getByText('next'));
    expect(onPageChange).toHaveBeenCalledWith(2);
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
});
