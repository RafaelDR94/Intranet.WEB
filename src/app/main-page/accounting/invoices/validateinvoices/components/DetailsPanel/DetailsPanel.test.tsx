import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import DetailsPanel from './DetailsPanel';

const currentPagePermissionsMock = { canSendToSap: true };

vi.mock('./hooks/useDetailsPanel', () => ({
  useDetailsPanel: () => ({
    labels: { left: 'Usuario: Test', right: 'Codigo: Demo' },
    expenseTypeCatalog: [],
    openRejectInvoice: false,
    openValidInvoice: false,
    setOpenRejectInvoice: vi.fn(),
    setOpenValidInvoice: vi.fn(),
    handleSubmitComment: vi.fn(),
    handleUpdateJsonSapItem: vi.fn(),
    handleSubmitReject: vi.fn(),
    handleSubmitValid: vi.fn(),
  }),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: currentPagePermissionsMock }),
}));

vi.mock('@/app/components/DetailsPanelLayout/DetailsPanelLayout', () => ({
  __esModule: true,
  default: ({ leftLabel, rightLabel, actionButton, children }: any) => (
    <div>
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
      {actionButton}
      {children}
    </div>
  ),
}));

describe('DetailsPanel', () => {
  it('muestra labels del panel', () => {
    const setPanelOpen = vi.fn();
    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={setPanelOpen}
        selected={null}
        rejectType={false}
        operations={false}
      />,
    );
    expect(screen.getByText('Usuario: Test')).toBeInTheDocument();
    expect(screen.getByText('Codigo: Demo')).toBeInTheDocument();
  });

  it('deshabilita Enviar a SAP cuando falta claveInterna en json_sap', () => {
    const setPanelOpen = vi.fn();
    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={setPanelOpen}
        selected={{
          billingdocument_id: 'doc-1',
          json_sap: {
            items: [{ itemIndex: 1, claveInterna: '', claveProdServ: '90101501' }],
          },
        } as any}
        rejectType={false}
        operations={false}
        sendInvoiceToSap
        onSendToSap={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Enviar a SAP' })).toBeDisabled();
  });
});
