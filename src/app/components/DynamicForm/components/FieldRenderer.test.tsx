import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FieldRenderer } from './FieldRenderer';
import { FieldModel } from '../types';

// Opcional: mock del Select para evitar errores con SVGs
vi.mock('../../Select/Select', () => ({
  Select: ({ label }: any) => <div>{label}</div>,
}));

describe('FieldRenderer', () => {

  it('renderiza un checkbox correctamente', () => {
    const field: FieldModel = {
      type: 'checkbox',
      name: 'acepto',
      label: 'Acepto',
      value: true,
    };

    render(
      <FieldRenderer
        field={field}
        value={true}
        allValues={{}}
        onChange={vi.fn()}
        variant="default"
      />
    );

    expect(screen.getByText('Acepto')).toBeInTheDocument();
  });

  it('renderiza un select con opciones', () => {
    const field: FieldModel = {
      type: 'select',
      name: 'ubicacion',
      label: 'Ubicación',
      options: [
        { label: 'CDMX', value: 'cdmx' },
        { label: 'MTY', value: 'mty' },
      ],
      value: '',
    };

    render(
      <FieldRenderer
        field={field}
        value=""
        allValues={{}}
        onChange={vi.fn()}
        variant="default"
      />
    );

    expect(screen.getByText('Ubicación')).toBeInTheDocument(); // 👈 más seguro que `getByLabelText`
  });

  it('renderiza NumberControl con controles', () => {
    const field: FieldModel = {
      type: 'numberControl',
      name: 'cantidad',
      label: 'Cantidad',
      value: 1,
      min: 0,
      max: 5,
    };

    render(
      <FieldRenderer
        field={field}
        value={1}
        allValues={{}}
        onChange={vi.fn()}
        variant="default"
      />
    );

    expect(screen.getByText('Cantidad')).toBeInTheDocument();
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });
});
