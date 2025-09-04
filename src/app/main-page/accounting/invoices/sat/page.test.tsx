import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SAT from './page';

vi.mock('./hooks/useSAT', () => ({
  __esModule: true,
  default: () => ({
    handleOpenDetails: vi.fn(),
    billingDocumentsValid: [],
    billingDocumentsEfos: [],
    billingDocumentsBadCode: [],
    billingDocumentsNotValid: [],
    panelOpen: { state: false, onlyText: false, rejectInvoice: false, sendInvoiceToSap: false },
    setPanelOpen: vi.fn(),
    selected: null,
    multiSelected: [],
    handleSendToSap: vi.fn(),
    handleMultiSelect: vi.fn(),
  }),
}));

vi.mock('../validateinvoices/components/DetailsPanel/DetailsPanel', () => ({
  __esModule: true,
  default: () => <div>DetailsPanel</div>,
}));

vi.mock('@/app/components/DataTable/DataTable', () => ({
  __esModule: true,
  DataTable: ({ actionsRender }: any) => (
    <div>
      DataTable
      {actionsRender && actionsRender()}
    </div>
  ),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: {} }),
}));

describe('SAT page', () => {
  it('renders tables and details panel', () => {
    render(<SAT />);
    expect(screen.getAllByText('DataTable').length).toBeGreaterThan(0);
    expect(screen.getByText('DetailsPanel')).toBeInTheDocument();
  });
});