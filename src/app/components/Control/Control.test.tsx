import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Control } from './Control';
import { ControlProps } from './types';

const makeProps = (overrides: Partial<ControlProps> = {}): ControlProps => ({
  onIncrement: vi.fn(),
  onDecrement: vi.fn(),
  inputSize: 'md',
  ...overrides,
});

describe('Control component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza dos botones y ambos íconos', () => {
    render(<Control {...makeProps()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);

    expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('llama onIncrement al hacer click en "+" cuando está habilitado', () => {
    const props = makeProps();
    render(<Control {...props} />);
    const [minusBtn, plusBtn] = screen.getAllByRole('button');
    fireEvent.click(plusBtn);
    expect(props.onIncrement).toHaveBeenCalledTimes(1);
    expect(props.onDecrement).not.toHaveBeenCalled();
  });

  it('llama onDecrement al hacer click en "−" cuando está habilitado', () => {
    const props = makeProps();
    render(<Control {...props} />);
    const [minusBtn] = screen.getAllByRole('button');
    fireEvent.click(minusBtn);
    expect(props.onDecrement).toHaveBeenCalledTimes(1);
    expect(props.onIncrement).not.toHaveBeenCalled();
  });

  it('deshabilita TODO cuando disable=true', () => {
    const props = makeProps({ disable: true });
    render(<Control {...props} />);
    const [minusBtn, plusBtn] = screen.getAllByRole('button');

    expect(minusBtn).toBeDisabled();
    expect(plusBtn).toBeDisabled();
    expect(minusBtn).toHaveAttribute('tabIndex', '-1');
    expect(plusBtn).toHaveAttribute('tabIndex', '-1');

    fireEvent.click(minusBtn);
    fireEvent.click(plusBtn);
    expect(props.onDecrement).not.toHaveBeenCalled();
    expect(props.onIncrement).not.toHaveBeenCalled();

    // ⬇️ FIX: el wrapper es el parent inmediato del botón
    const wrapper = minusBtn.parentElement as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-disabled', 'true');
  });

  it('deshabilita solo el botón "+" cuando disablePlus=true', () => {
    const props = makeProps({ disablePlus: true });
    render(<Control {...props} />);
    const [minusBtn, plusBtn] = screen.getAllByRole('button');

    expect(plusBtn).toBeDisabled();
    expect(minusBtn).not.toBeDisabled();

    fireEvent.click(minusBtn);
    fireEvent.click(plusBtn);

    expect(props.onDecrement).toHaveBeenCalledTimes(1);
    expect(props.onIncrement).not.toHaveBeenCalled();
  });

  it('deshabilita solo el botón "−" cuando disableMinus=true', () => {
    const props = makeProps({ disableMinus: true });
    render(<Control {...props} />);
    const [minusBtn, plusBtn] = screen.getAllByRole('button');

    expect(minusBtn).toBeDisabled();
    expect(plusBtn).not.toBeDisabled();

    fireEvent.click(minusBtn);
    fireEvent.click(plusBtn);

    expect(props.onDecrement).not.toHaveBeenCalled();
    expect(props.onIncrement).toHaveBeenCalledTimes(1);
  });

  it('si falta onIncrement, el botón "+" se deshabilita automáticamente', () => {
    const props = makeProps({ onIncrement: undefined });
    render(<Control {...props} />);
    const [, plusBtn] = screen.getAllByRole('button');
    expect(plusBtn).toBeDisabled();
  });

  it('si falta onDecrement, el botón "−" se deshabilita automáticamente', () => {
    const props = makeProps({ onDecrement: undefined });
    render(<Control {...props} />);
    const [minusBtn] = screen.getAllByRole('button');
    expect(minusBtn).toBeDisabled();
  });

  it('aplica clases de tamaño para inputSize="sm" (espera h-8 en el contenedor)', () => {
    const { container } = render(<Control {...makeProps({ inputSize: 'sm' })} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('h-8'); // definido en styles.ts
  });

  it('aplica clases de tamaño para inputSize="md" (espera h-10 en el contenedor)', () => {
    const { container } = render(<Control {...makeProps({ inputSize: 'md' })} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('h-10');
  });

  it('aplica clases de tamaño para inputSize="lg" (espera h-12 en el contenedor)', () => {
    const { container } = render(<Control {...makeProps({ inputSize: 'lg' })} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('h-12');
  });
});
