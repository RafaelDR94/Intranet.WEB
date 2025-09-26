import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Spinner } from './Spinner';
import type { SpinnerSize } from './types';

describe('Spinner', () => {
  it('renderiza sin errores con tamaño por defecto', () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toBeDefined();
    expect(spinner.className).toContain('animate-spin');
    expect(spinner.className).toContain('border-l-green-90');
  });

  it('renderiza con todos los tamaños correctamente', () => {
    const sizes: SpinnerSize[] = ['giant', 'large', 'medium', 'small', 'tiny'];
    sizes.forEach((size) => {
      const { container } = render(<Spinner size={size} />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toBeDefined();
      expect(spinner.className).toContain('animate-spin');
    });
  });
  it('propaga dataTestId al contenedor', () => {
    const { getByTestId } = render(<Spinner dataTestId="spin" />);
    expect(getByTestId('spin')).toBeInTheDocument();
  });
});
