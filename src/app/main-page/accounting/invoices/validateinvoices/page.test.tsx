import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import ValidateInvoices from './page';

vi.mock('./components/DetailsPanel/DetailsPanel', () => ({
  __esModule: true,
  default: () => <div>DetailsPanel</div>,
}));

vi.mock('./hooks/useValidateInvoices', () => ({
  __esModule: true,
  useValidateInvoices: () => ({
    handleOpenDetails: vi.fn(),
    billingDocuments: [],
    billingDocumentnotToday: [],
    panelOpen: false,
    setPanelOpen: vi.fn(),
    selected: null,
    handleMultiSelectt1: vi.fn(),
    handleMultiSelectt2: vi.fn(),
    handleActionClick: vi.fn(),
    openValidInvoice: false,
    setOpenValidInvoice: vi.fn(),
    handleMultiValidate: vi.fn(),
    multiselectedt1: [],
    multiselectedt2: [],
  }),
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

vi.mock('@/app/components/PopUp/PopUp', () => ({
  __esModule: true,
  PopUp: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: {} }),
}));

describe('ValidateInvoices page', () => {
  it('renders tables and details panel', () => {
    render(<ValidateInvoices />);
    expect(screen.getAllByText('DataTable').length).toBeGreaterThan(0);
    expect(screen.getByText('DetailsPanel')).toBeInTheDocument();
  });
});