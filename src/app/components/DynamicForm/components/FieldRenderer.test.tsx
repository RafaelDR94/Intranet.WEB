import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { FieldModel } from '../types';

import { FieldRenderer } from './FieldRenderer';


// Opcional: mock del Select para evitar errores con SVGs
vi.mock('../../Select/Select', () => ({
  Select: ({ label }: any) => <div>{label}</div>,
}));

vi.mock('../../ControlLevel/ControlLevel', () => ({
  ControlLevel: ({ title, level, setLevel, className }: any) => (
    <div data-testid="control-level" data-title={title} data-level={level} className={className}>
      {title}
      <button onClick={() => setLevel?.(0.8)}>set</button>
    </div>
  ),
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

  it('propaga dataTestId combinando formulario y nombre', () => {
    const field: FieldModel = {
      type: 'input',
      name: 'nombre',
      label: 'Nombre',
      value: '',
    };
    render(
      <FieldRenderer
        field={field}
        value=""
        allValues={{}}
        onChange={vi.fn()}
        variant="default"
        formDataTestId="form"
      />
    );
    expect(screen.getByTestId('form-nombre')).toBeInTheDocument();
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

  it('renderiza ControlLevel y propaga cambios', () => {
    const onChange = vi.fn();
    const field: FieldModel = {
      type: 'controlLevel',
      name: 'nivel',
      label: 'Nivel de servicio',
      value: 0.5,
      controlLevelProps: {
        min: 0,
        max: 1,
        divisions: 4,
        showSemicircle: false,
      },
    };

    render(
      <FieldRenderer
        field={field}
        value={0.5}
        allValues={{}}
        onChange={onChange}
        variant="default"
      />
    );

    const controlLevel = screen.getByTestId('control-level');
    expect(controlLevel).toHaveAttribute('data-title', 'Nivel de servicio');
    expect(controlLevel).toHaveAttribute('data-level', '0.5');

    screen.getByText('set').click();
    expect(onChange).toHaveBeenCalledWith(0.8);
  });

  it('renderiza CheckBoxList y propaga selección', () => {
    const onChange = vi.fn();
    const field: FieldModel = {
      type: 'checkboxList',
      name: 'docs',
      label: 'Documentos',
      value: ['card'],
      options: [
        { label: 'Tarjeta', value: 'card' },
        { label: 'Póliza', value: 'policy' },
      ],
    };

    render(
      <FieldRenderer
        field={field}
        value={['card']}
        allValues={{}}
        onChange={onChange}
        variant="default"
      />
    );

    const policyCheckbox = screen.getByLabelText('Póliza');
    fireEvent.click(policyCheckbox);
    expect(onChange).toHaveBeenCalledWith(['card', 'policy']);
  });
});
