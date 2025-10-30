import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import PaginationDots from './PaginationDots';
import { Props } from './types';

describe('PaginationDots', () => {
  const setup = (props: Props) => render(<PaginationDots {...props} />);

  it('debería renderizar la cantidad correcta de botones', () => {
    setup({ totalPages: 5, currentPage: 0, onPageChange: vi.fn() });

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('debería aplicar la clase activa al botón correspondiente', () => {
    setup({ totalPages: 3, currentPage: 1, onPageChange: vi.fn() });

    const buttons = screen.getAllByRole('button');

    // Verifica que solo el segundo tenga la clase de botón activo
    buttons.forEach((button, index) => {
      if (index === 1) {
        expect(button.className).toContain('bg-green-90'); // Activo
      } else {
        expect(button.className).toContain('bg-green-30'); // Inactivo
      }
    });
  });

  it('debería ejecutar onPageChange con el índice correcto al hacer clic', () => {
    const mockFn = vi.fn();
    setup({ totalPages: 4, currentPage: 0, onPageChange: mockFn });

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(2);
  });

  it('debería ocultar los botones más allá del índice 6', () => {
    setup({ totalPages: 10, currentPage: 0, onPageChange: vi.fn() });

    const buttons = screen.getAllByRole('button');
    const hiddenButtons = buttons.filter((btn) => btn.className.includes('hidden'));

    // Debería haber 3 botones ocultos: índices 7, 8, 9
    expect(hiddenButtons).toHaveLength(3);
  });
});
