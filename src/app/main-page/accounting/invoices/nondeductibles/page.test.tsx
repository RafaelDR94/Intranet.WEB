import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import NonDeductiblesPage from './page';

const detailsPanelMock = vi.fn(() => <div>DetailsPanel</div>);

vi.mock('../validateinvoices/components/DetailsPanel/DetailsPanel', () => ({
  __esModule: true,
  default: (props: any) => detailsPanelMock(props),
}));

vi.mock('../validateinvoices/hooks/useValidateInvoices', () => ({
  __esModule: true,
  useValidateInvoices: () => ({
    nonDeductibleDocuments: [],
    pendingNonDeductibleDocuments: [],
    panelOpen: false,
    setPanelOpen: vi.fn(),
    selected: null,
    handleOpenDetails: vi.fn(),
    handleMultiSelectNonDeductibleNew: vi.fn(),
    handleMultiSelectNonDeductiblePending: vi.fn(),
    handleSendNonDeductibleToSap: vi.fn(),
    handleSendSelectedNonDeductibleToSap: vi.fn(),
    multiselectedNonDeductibleNew: [],
    multiselectedNonDeductiblePending: [],
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

vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ children, hideIcon, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: {} }),
}));

describe('NonDeductiblesPage', () => {
  it('configura el detalle para enviar a SAP sin mostrar validacion', () => {
    render(<NonDeductiblesPage />);

    expect(screen.getAllByText('DataTable').length).toBeGreaterThan(0);
    expect(screen.getByText('DetailsPanel')).toBeInTheDocument();
    expect(detailsPanelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        validInvoice: false,
        sendInvoiceToSap: true,
        allowSendToSapAction: true,
        bypassSendToSapValidation: true,
        documentLabel: 'Archivo',
      }),
    );
  });
});
