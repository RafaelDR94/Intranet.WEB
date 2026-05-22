import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import Requisitions from './requisitions/page';
import type { PrincipalContextValue } from '@/app/context/PrincipalContext/types';

const useSearchParams = vi.hoisted(() => vi.fn());
const usePathname = vi.hoisted(() => vi.fn());
const useRouter = vi.hoisted(() => vi.fn());
const usePrincipal = vi.hoisted(() => vi.fn());
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
  usePathname: () => usePathname(),
  useRouter: () => useRouter(),
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => usePrincipal(),
}));

vi.mock('@/app/main-page/request/ownrequisitions/billablefiles/page', () => ({
  __esModule: true,
  default: BillableFilesPage,
}));

vi.mock('./requisitions/componentes/RequisitionsDetails/RequisitionDetails', () => ({
  __esModule: true,
  default: RequisitionDetails,
}));

vi.mock('./requisitions/componentes/RequisitionsTable/RequisitionsTable', () => ({
  __esModule: true,
  default: RequisitionsTable,
}));

describe('PersonalInvoices Requisitions page', () => {
  const principalMock: PrincipalContextValue = {
    usePrincipalTheme: {
      theme: 'light',
      toggleTheme: vi.fn(),
      setDarkTheme: vi.fn(),
    },
    usePrincipalAlert: {
      alert: null,
      showAlert: vi.fn(),
      hideAlert: vi.fn(),
    },
    usePrincipalLoading: {
      open: false,
      message: undefined,
      spinnerSize: 'medium',
      showSpinner: vi.fn(),
      hideSpinner: vi.fn(),
      withLoading: vi.fn(async (task) => task()),
    },
    usePrincipalImage: {
      state: { open: false },
      showImage: vi.fn(),
      hideImage: vi.fn(),
    },
  };

  it('renders billable files page when view=billablefiles', () => {
    usePrincipal.mockReturnValue(principalMock);
    usePathname.mockReturnValue('/main-page/request/ownrequisitions/requisitions');
    useRouter.mockReturnValue({ push: vi.fn(), replace: vi.fn(), back: vi.fn() });
    useSearchParams.mockReturnValue({
      get: (key: string) => (key === 'view' ? 'billablefiles' : null),
    });

    render(<Requisitions />);

    expect(screen.getByText('BillableFilesPageMock')).toBeInTheDocument();
    expect(RequisitionDetails).not.toHaveBeenCalled();
    expect(RequisitionsTable).not.toHaveBeenCalled();
  });

  it('renders requisitions details and table when view is not billablefiles', () => {
    usePrincipal.mockReturnValue(principalMock);
    usePathname.mockReturnValue('/main-page/request/ownrequisitions/requisitions');
    useRouter.mockReturnValue({ push: vi.fn(), replace: vi.fn(), back: vi.fn() });
    useSearchParams.mockReturnValue({
      get: (key: string) => (key === 'id' ? 'REQ-1' : null),
    });

    render(<Requisitions />);

    expect(screen.getByText('RequisitionDetailsMock')).toBeInTheDocument();
    expect(screen.getByText('RequisitionsTableMock')).toBeInTheDocument();
  });

  it('renders only requisitions table when view is not billablefiles and there is no id', () => {
    usePrincipal.mockReturnValue(principalMock);
    usePathname.mockReturnValue('/main-page/request/ownrequisitions/requisitions');
    useRouter.mockReturnValue({ push: vi.fn(), replace: vi.fn(), back: vi.fn() });
    useSearchParams.mockReturnValue({
      get: () => null,
    });

    render(<Requisitions />);

    expect(screen.queryByText('RequisitionDetailsMock')).not.toBeInTheDocument();
    expect(screen.getByText('RequisitionsTableMock')).toBeInTheDocument();
  });
});
