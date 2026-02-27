import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import RequisitionListPage from './page';

const useSearchParamsMock = vi.fn(() => new URLSearchParams());
const requisitionsFilesMock = vi.fn();
const useRouterMock = vi.fn(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useSearchParams: () => useSearchParamsMock(),
  useRouter: () => useRouterMock(),
}));
vi.mock('@/tutorials/engine/useTutorialAutoRun', () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock('./components/RequisitionDetails/RequisitionDetails', () => ({
  __esModule: true,
  default: () => <div>Detalle</div>,
}));

vi.mock(
  '@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/RequisitionsTable',
  () => ({
    __esModule: true,
    default: () => <div>Tabla</div>,
  }),
);

vi.mock('./components/UserRequisitionsList/UserRequisitionsList', () => ({
  __esModule: true,
  default: (props: unknown) => {
    requisitionsFilesMock(props);
    return <div>Requisiciones</div>;
  },
}));

vi.mock('./components/TicketsFiles/TicketsFiles', () => ({
  __esModule: true,
  default: () => <div>Tickets</div>,
}));

vi.mock('./components/InvoicesFiles/InvoicesFiles', () => ({
  __esModule: true,
  default: () => <div>Facturas</div>,
}));

vi.mock(
  '@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsDetails/components/RequisitionDetailsDocuments/RequisitionDetailsDocument',
  () => ({
    __esModule: true,
    default: () => <div>Documentos</div>,
  }),
);

describe('RequisitionListPage', () => {
  beforeEach(() => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams());
    requisitionsFilesMock.mockClear();
  });

  it('renders details and table when there is no label', () => {
    const { container } = render(<RequisitionListPage />);

    expect(container).toHaveTextContent('Detalle');
    expect(container).toHaveTextContent('Tabla');
  });

  it('renders documents and table for archivos view', () => {
    useSearchParamsMock.mockReturnValueOnce(new URLSearchParams('label=Archivos%20Bruno'));

    const { container } = render(<RequisitionListPage />);

    expect(screen.queryByText('Detalle')).not.toBeInTheDocument();
    expect(screen.getByText('Tickets')).toBeInTheDocument();
    expect(screen.getByText('Facturas')).toBeInTheDocument();
    expect(container.childElementCount).toBeGreaterThan(0);
  });

  it('renders only requisitions table for requisiciones view', () => {
    useSearchParamsMock.mockReturnValueOnce(new URLSearchParams('label=Requisiciones%20Bruno&id=99'));

    const { container } = render(<RequisitionListPage />);

    expect(screen.queryByText('Detalle')).not.toBeInTheDocument();
    expect(screen.queryByText('Documentos')).not.toBeInTheDocument();
    expect(screen.getByText('Requisiciones')).toBeInTheDocument();
    expect(container.childElementCount).toBeGreaterThan(0);
    expect(requisitionsFilesMock).toHaveBeenCalledWith(
      expect.objectContaining({ forceVisible: true, userId: '99' }),
    );
  });
});

