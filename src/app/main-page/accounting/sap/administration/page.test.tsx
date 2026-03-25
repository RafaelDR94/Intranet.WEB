import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import SapAdministrationPage from './page';

import type { BillingDocumentsSatTable } from '@/app/mappings/billingdocuments/billingdocuments.types';

const DataTable = vi.hoisted(() =>
  vi.fn(() => <div>DataTableMock</div>),
);
const DetailsPanel = vi.hoisted(() =>
  vi.fn(() => <div>DetailsPanelMock</div>),
);
const useSAP = vi.hoisted(() => vi.fn());

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable,
}));

vi.mock('./components/DetailsPanel', () => ({
  __esModule: true,
  default: DetailsPanel,
}));

vi.mock('./hooks/useSAP', () => ({
  __esModule: true,
  default: () => useSAP(),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    currentPagePermissions: { canSeeDetails: false, canSendToSap: false },
  }),
}));

vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
}));

vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper', () => ({
  BillingDocumentsSatTableListMap: (rows: BillingDocumentsSatTable[]) => rows,
}));

describe('SAP Administration page', () => {
  it('renders the data table and details panel', () => {
    useSAP.mockReturnValue({
      handleOpenDetails: vi.fn(),
      billingDocuments: [],
      nonDeductibleDocuments: [],
      panelOpen: {
        state: false,
        onlyText: false,
        rejectInvoice: false,
        sendInvoiceToSap: false,
      },
      setPanelOpen: vi.fn(),
      selected: null,
      multiSelected: [],
      multiSelectedNonDeductible: [],
      handleSendToSap: vi.fn(),
      handleMultiSelect: vi.fn(),
      handleMultiSelectNonDeductible: vi.fn(),
    });

    render(<SapAdministrationPage />);

    expect(screen.getAllByText('DataTableMock').length).toBeGreaterThan(0);
    expect(screen.getByText('DetailsPanelMock')).toBeInTheDocument();
  });
});
