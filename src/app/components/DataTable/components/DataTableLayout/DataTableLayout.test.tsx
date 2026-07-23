import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import DataTableLayout from './DataTableLayout';

vi.mock('@/assets/icons/organization/filter-alt.svg', () => ({ default: () => <span /> }));
vi.mock('@/app/components/Filter/Filter', () => ({
  __esModule: true,
  default: ({
    onChange,
    groups,
  }: {
    onChange?: (value: string) => void
    groups?: Array<{ onChange?: (value: string) => void }>
  }) => (
    <button
      type="button"
      onClick={() => groups?.[0]?.onChange?.('selected') ?? onChange?.('selected')}
    >
      Filter
    </button>
  ),
}));
vi.mock('@/assets/icons/organization/search.svg', () => ({ default: () => <span /> }));
vi.mock('@/assets/icons/acciones/refresh-double.svg', () => ({ default: () => <span /> }));
vi.mock('@/app/components/Calendar/Calendar', () => ({ Calendar: () => <span /> }));

describe('DataTableLayout', () => {
  it('calls onSearchChange when typing', () => {
    const onSearchChange = vi.fn();
    render(<DataTableLayout onSearchChange={onSearchChange} />);
    fireEvent.change(screen.getByPlaceholderText('Buscar'), { target: { value: 'hola' } });
    expect(onSearchChange).toHaveBeenCalledWith('hola');
  });

  it('propagates filter changes and click events', () => {
    const onFilterClick = vi.fn();
    const onFilterChange = vi.fn();
    render(
      <DataTableLayout
        showFilter
        showButton={false}
        onFilterClick={onFilterClick}
        onFilterChange={onFilterChange}
        filterOptions={[{ label: 'Todos', value: 'selected' }]}
      />,
    );

    fireEvent.click(screen.getByText('Filter'));
    expect(onFilterChange).toHaveBeenCalledWith('selected');
    expect(onFilterClick).toHaveBeenCalled();
  });

  it('adapts independent filter groups without affecting the simple filter API', () => {
    const onChange = vi.fn()
    render(
      <DataTableLayout
        showFilter
        showButton={false}
        filterGroups={[
          {
            title: 'Asignación',
            options: [{ label: 'Asignados', value: 'selected' }],
            value: 'all',
            onChange,
          },
        ]}
      />,
    )

    fireEvent.click(screen.getByText('Filter'))
    expect(onChange).toHaveBeenCalledWith('selected', {
      label: 'Asignados',
      value: 'selected',
    })
  })

  it('invokes refresh callback when the button is pressed', () => {
    const onRefreshPage = vi.fn();
    render(<DataTableLayout showRefresh onRefreshPage={onRefreshPage} />);

    fireEvent.click(screen.getByRole('button', { name: /actualizar tabla/i }));
    expect(onRefreshPage).toHaveBeenCalledTimes(1);
  });
});
