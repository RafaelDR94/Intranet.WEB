import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberControl } from './NumberControl';

describe('NumberControl component', () => {
  it('renderiza con etiqueta y valor por defecto', () => {
    render(<NumberControl defaultValue={5} label="Cantidad" />);
    expect(screen.getByText('Cantidad')).toBeInTheDocument();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveValue('5');
  });

  it('incrementa y decrementa dentro del rango', () => {
    render(<NumberControl defaultValue={5} min={0} max={10} step={2} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const plusBtn = screen.getByTestId('plus-icon').closest('button') as HTMLButtonElement;
    const minusBtn = screen.getByTestId('minus-icon').closest('button') as HTMLButtonElement;

    fireEvent.click(plusBtn);
    expect(input).toHaveValue('7');

    fireEvent.click(minusBtn);
    fireEvent.click(minusBtn);
    expect(input).toHaveValue('3');
  });

  it('clampa el valor al perder foco cuando excede el máximo', () => {
    render(<NumberControl defaultValue={5} min={0} max={10} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '15' } });
    fireEvent.blur(input);
    expect(input).toHaveValue('10');
  });
});