import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DataTableLayout from './DataTableLayout';

vi.mock('@/assets/icons/organization/filter-alt.svg', () => ({ default: () => <span /> }));
vi.mock('@/assets/icons/organization/search.svg', () => ({ default: () => <span /> }));
vi.mock('@/app/components/Calendar/Calendar', () => ({ Calendar: () => <span /> }));

describe('DataTableLayout', () => {
  it('calls onSearchChange when typing', () => {
    const onSearchChange = vi.fn();
    render(<DataTableLayout onSearchChange={onSearchChange} />);
    fireEvent.change(screen.getByPlaceholderText('Buscar'), { target: { value: 'hola' } });
    expect(onSearchChange).toHaveBeenCalledWith('hola');
  });

  it('triggers onFilterClick when filter button is clicked', () => {
    const onFilterClick = vi.fn();
    render(<DataTableLayout showFilter showButton={false} onFilterClick={onFilterClick} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(onFilterClick).toHaveBeenCalled();
  });
});
