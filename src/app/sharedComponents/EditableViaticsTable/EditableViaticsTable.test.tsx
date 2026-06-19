import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { EditableViaticsTable } from './EditableViaticsTable';
import { EditableViaticsRow } from './types';

const rows: EditableViaticsRow[] = [
  { id: '1', concept: 'Renta de automóvil', nationalQuoted: '00', foreignQuoted: '00', people: '00', days: '00', subtotal: '00', observations: 'Escribe aquí' },
  { id: '2', concept: 'Boleto de autobús', nationalQuoted: '600', foreignQuoted: '00', people: '2', days: '2', subtotal: '2,400', observations: 'ida y vuelta' },
];

describe('EditableViaticsTable', () => {
  it('renderiza encabezados y filas', () => {
    render(<EditableViaticsTable defaultValue={rows} dataTestId="viatics-table" />);
    expect(screen.getByTestId('viatics-table')).toHaveClass('bg-white-100', 'rounded-lg');
    expect(screen.getByText('Concepto')).toBeInTheDocument();
    expect(screen.getByText('Renta de automóvil')).toBeInTheDocument();
  });

  it('actualiza una celda y emite onChange', () => {
    const onChange = vi.fn();
    render(<EditableViaticsTable defaultValue={rows} onChange={onChange} />);

    const input = screen.getByLabelText('Renta de automóvil-nationalQuoted');
    fireEvent.change(input, { target: { value: '900' } });

    expect(onChange).toHaveBeenCalled();
    const nextRows = onChange.mock.calls.at(-1)?.[0] as EditableViaticsRow[];
    expect(nextRows[0].nationalQuoted).toBe('900');
  });

  it('calcula subtotal desde la columna subtotal', () => {
    render(<EditableViaticsTable defaultValue={rows} />);
    expect(screen.getAllByText('2,400')).toHaveLength(2);
  });

  it('dispara onBlurCell con contexto de fila y campo', () => {
    const onBlurCell = vi.fn();
    render(<EditableViaticsTable defaultValue={rows} onBlurCell={onBlurCell} />);

    const input = screen.getByLabelText('Boleto de autobús-observations');
    fireEvent.blur(input, { target: { value: 'actualizado' } });

    expect(onBlurCell).toHaveBeenCalledWith('2', 'observations', 'actualizado');
  });
});
