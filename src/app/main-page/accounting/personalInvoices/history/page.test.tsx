import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import PersonalInvoicesHistory from './page';

import type { DataTableProps } from '@/app/components/DataTable/types';
import type { HistoryRow } from '@/app/mappings/billinghistory/billinghistory.types';

const DataTable = vi.hoisted(() =>
  vi.fn(({ tables }: DataTableProps<HistoryRow>) => (
    <div>{tables.map((table) => table.title).join('|')}</div>
  )),
);
const SideMenu = vi.hoisted(() => vi.fn(() => <div>SideMenuMock</div>));
const useHistory = vi.hoisted(() => vi.fn());

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable,
}));

vi.mock('./components/SideMenu', () => ({
  __esModule: true,
  default: SideMenu,
}));

vi.mock('./hooks/useHistory', () => ({
  __esModule: true,
  default: () => useHistory(),
}));

vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { canSeeDetails: true } }),
}));

vi.mock('../invoices/context/InvoicesContext', () => ({
  InvoicesProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const historyRow: HistoryRow = {
  id: '1',
  billing_image_id: 'img-1',
  billingdocument_id: 'doc-1',
  project: {
    id: 'proj-1',
    name: 'Proj',
    proyectKey: 'PR-1',
    client: 'Client',
    manager: {} as HistoryRow['project']['manager'],
    collaborators: [],
  },
  requisitionkey: 'R1',
  status: 'valido',
  xml: '',
  pdf: '',
  image: '',
  comments: '',
  dateCreate: '2025-01-01',
  certificationDate: '2025-01-01',
  uuid: 'uuid-1',
  description: { id_billingdescription: 'desc-1', name: 'Desc' },
  category: { id_billingcategory: 'cat-1', name: 'Cat' },
  numpersons: 1,
  numnights: 1,
};

describe('PersonalInvoicesHistory', () => {
  it('renders history and rejected tables with side menu', () => {
    useHistory.mockReturnValue({
      panelOpen: false,
      setPanelOpen: vi.fn(),
      selected: historyRow,
      setSelected: vi.fn(),
      rejected: [historyRow],
      history: [historyRow],
    });

    render(<PersonalInvoicesHistory />);

    expect(DataTable).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Rechazadas')).toBeInTheDocument();
    expect(screen.getByText('Historial')).toBeInTheDocument();
    expect(screen.getByText('SideMenuMock')).toBeInTheDocument();
  });
});
