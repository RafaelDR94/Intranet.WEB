import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import CustomRadio from './CustomRadio';

describe('CustomRadio', () => {
  const defaultProps = {
    id: 'radio1',
    name: 'options',
    value: 'option1',
    checked: false,
    onChange: vi.fn(),
  };

  it('renderiza correctamente con label', () => {
    render(<CustomRadio {...defaultProps} label="Opción 1" />);

    const radioInput = screen.getByRole('radio');
    const labelText = screen.getByText('Opción 1');

    expect(radioInput).toBeInTheDocument();
    expect(radioInput).toHaveAttribute('type', 'radio');
    expect(labelText).toBeInTheDocument();
  });

  it('llama a onChange al hacer clic', () => {
    render(<CustomRadio {...defaultProps} />);

    const radioInput = screen.getByRole('radio');
    fireEvent.click(radioInput);

    expect(defaultProps.onChange).toHaveBeenCalledWith('option1');
  });

  it('se desactiva cuando disabled=true', () => {
    render(<CustomRadio {...defaultProps} disabled />);

    const radioInput = screen.getByRole('radio');
    expect(radioInput).toBeDisabled();
  });

  it('muestra el estado checked correctamente', () => {
    render(<CustomRadio {...defaultProps} checked={true} />);

    const radioInput = screen.getByRole('radio');
    expect(radioInput).toBeChecked();
  });

  it('no muestra el span de marca si no está seleccionado', () => {
    const { container } = render(<CustomRadio {...defaultProps} checked={false} />);
    const checkedSpan = container.querySelector(`.${'radioChecked'}`);
    expect(checkedSpan).not.toBeInTheDocument();
  });
});
