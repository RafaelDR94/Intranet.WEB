import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import RequisitionListPage from './page';

const useSearchParamsMock = vi.fn(() => new URLSearchParams());

vi.mock('next/navigation', () => ({
  useSearchParams: () => useSearchParamsMock(),
}));

vi.mock(
  '@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsDetails/RequisitionDetails',
  () => ({
    __esModule: true,
    default: () => <div>Detalle</div>,
  }),
);

vi.mock(
  '@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/RequisitionsTable',
  () => ({
    __esModule: true,
    default: () => <div>Tabla</div>,
  }),
);

describe('RequisitionListPage', () => {
  it('renders details and table when there is no label', () => {
    const { container } = render(<RequisitionListPage />);

    expect(container).toHaveTextContent('Detalle');
    expect(container).toHaveTextContent('Tabla');
  });

  it('renders blank page for archivos or requisiciones views', () => {
    useSearchParamsMock.mockReturnValueOnce(new URLSearchParams('label=Archivos%20Bruno'));

    const { container } = render(<RequisitionListPage />);

    expect(screen.queryByText('Detalle')).not.toBeInTheDocument();
    expect(screen.queryByText('Tabla')).not.toBeInTheDocument();
    expect(container.childElementCount).toBe(1);
    expect(container.firstElementChild?.textContent).toBe('');
  });
});

