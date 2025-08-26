import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

const setup = (currentPage: number, totalPages: number, onPageChange = vi.fn()) =>
  render(<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />);

describe('Pagination', () => {
  it('renderiza la cantidad correcta de botones', () => {
    setup(1, 3);
    expect(screen.getAllByRole('button')).toHaveLength(5); // 3 pages + 2 arrows
  });

  it('llama onPageChange al hacer clic en una página', () => {
    const mock = vi.fn();
    setup(1, 3, mock);
    fireEvent.click(screen.getByText('2'));
    expect(mock).toHaveBeenCalledWith(2);
  });
});
