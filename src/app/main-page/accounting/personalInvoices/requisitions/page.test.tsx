import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import Requisitions from './page';

const useSearchParams = vi.hoisted(() => vi.fn());
const BillableFilesPage = vi.hoisted(() =>
  vi.fn(() => <div>BillableFilesPageMock</div>),
);
const RequisitionDetails = vi.hoisted(() =>
  vi.fn(() => <div>RequisitionDetailsMock</div>),
);
const RequisitionsTable = vi.hoisted(() =>
  vi.fn(() => <div>RequisitionsTableMock</div>),
);

vi.mock('next/navigation', () => ({
  useSearchParams: () => useSearchParams(),
}));

vi.mock('@/app/main-page/accounting/billablefiles/billablefiles/page', () => ({
  __esModule: true,
  default: BillableFilesPage,
}));

vi.mock('./componentes/RequisitionsDetails/RequisitionDetails', () => ({
  __esModule: true,
  default: RequisitionDetails,
}));

vi.mock('./componentes/RequisitionsTable/RequisitionsTable', () => ({
  __esModule: true,
  default: RequisitionsTable,
}));

describe('PersonalInvoices Requisitions page', () => {
  it('renders billable files page when view=billablefiles', () => {
    useSearchParams.mockReturnValue({
      get: (key: string) => (key === 'view' ? 'billablefiles' : null),
    });

    render(<Requisitions />);

    expect(screen.getByText('BillableFilesPageMock')).toBeInTheDocument();
    expect(RequisitionDetails).not.toHaveBeenCalled();
    expect(RequisitionsTable).not.toHaveBeenCalled();
  });

  it('renders requisitions details and table when view is not billablefiles', () => {
    useSearchParams.mockReturnValue({
      get: () => null,
    });

    render(<Requisitions />);

    expect(screen.getByText('RequisitionDetailsMock')).toBeInTheDocument();
    expect(screen.getByText('RequisitionsTableMock')).toBeInTheDocument();
  });
});
