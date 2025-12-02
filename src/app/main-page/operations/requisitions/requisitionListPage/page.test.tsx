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

vi.mock(
  '@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsDetails/components/RequisitionDetailsDocuments/RequisitionDetailsDocument',
  () => ({
    __esModule: true,
    default: () => <div>Documentos</div>,
  }),
);

describe('RequisitionListPage', () => {
  it('renders details and table when there is no label', () => {
    const { container } = render(<RequisitionListPage />);

    expect(container).toHaveTextContent('Detalle');
    expect(container).toHaveTextContent('Tabla');
  });

  it('renders documents and table for archivos view', () => {
    useSearchParamsMock.mockReturnValueOnce(new URLSearchParams('label=Archivos%20Bruno'));

    const { container } = render(<RequisitionListPage />);

    expect(screen.queryByText('Detalle')).not.toBeInTheDocument();
    expect(screen.getByText('Documentos')).toBeInTheDocument();
    expect(screen.getByText('Tabla')).toBeInTheDocument();
    expect(container.childElementCount).toBeGreaterThan(0);
  });

  it('renders only requisitions table for requisiciones view', () => {
    useSearchParamsMock.mockReturnValueOnce(new URLSearchParams('label=Requisiciones%20Bruno'));

    const { container } = render(<RequisitionListPage />);

    expect(screen.queryByText('Detalle')).not.toBeInTheDocument();
    expect(screen.queryByText('Documentos')).not.toBeInTheDocument();
    expect(screen.getByText('Tabla')).toBeInTheDocument();
    expect(container.childElementCount).toBeGreaterThan(0);
  });
});

