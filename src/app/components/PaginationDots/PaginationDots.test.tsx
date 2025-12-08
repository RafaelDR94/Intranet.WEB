import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import PaginationDots from './PaginationDots';
import { Props } from './types';

describe('PaginationDots', () => {
  const setup = (props: Props) => render(<PaginationDots {...props} />);

  it('debería renderizar la cantidad correcta de puntos cuando hay pocas páginas', () => {
    setup({ totalPages: 5, currentPage: 0, onPageChange: vi.fn() });

    const pageButtons = screen.getAllByRole('button').filter(btn =>
      btn.getAttribute('aria-label')?.startsWith('P')
    );
    expect(pageButtons).toHaveLength(5);
  });

  it('debería aplicar la clase activa al botón correspondiente', () => {
    setup({ totalPages: 3, currentPage: 1, onPageChange: vi.fn() });

    const pageButtons = screen.getAllByRole('button').filter(btn =>
      btn.getAttribute('aria-label')?.startsWith('P')
    );

    pageButtons.forEach((button, index) => {
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

    const pageButtons = screen.getAllByRole('button').filter(btn =>
      btn.getAttribute('aria-label')?.startsWith('P')
    );
    fireEvent.click(pageButtons[2]);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(2);
  });

  it('debería mostrar flechas cuando hay más de 7 páginas', () => {
    setup({ totalPages: 10, currentPage: 0, onPageChange: vi.fn() });

    const prevArrow = screen.getByLabelText('PÇ­ginas anteriores');
    const nextArrow = screen.getByLabelText('PÇ­ginas siguientes');

    expect(prevArrow).toBeInTheDocument();
    expect(nextArrow).toBeInTheDocument();
  });

  it('debería desplazar la ventana al usar la flecha siguiente', () => {
    setup({ totalPages: 10, currentPage: 0, onPageChange: vi.fn() });

    const nextArrow = screen.getByLabelText('PÇ­ginas siguientes');
    fireEvent.click(nextArrow);

    const pageButtons = screen.getAllByRole('button').filter(btn =>
      btn.getAttribute('aria-label')?.startsWith('P')
    );

    // La primera página visible ya no debe ser la 1
    expect(pageButtons[0].getAttribute('aria-label')).not.toBe('PÇ­gina 1');
  });
});

