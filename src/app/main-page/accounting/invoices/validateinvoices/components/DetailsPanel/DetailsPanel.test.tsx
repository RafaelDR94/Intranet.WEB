import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import DetailsPanel from './DetailsPanel';

const currentPagePermissionsMock = { canSendToSap: true };
const useDetailsPanelMock = {
  labels: { left: 'Usuario: Test', right: 'Codigo: Demo' },
  expenseTypeCatalog: [],
  openRejectInvoice: false,
  openValidInvoice: false,
  setOpenRejectInvoice: vi.fn(),
  setOpenValidInvoice: vi.fn(),
  handleSubmitComment: vi.fn(),
  handleUpdateJsonSapItem: vi.fn(),
  handleUpdateJsonSapExpenseType: vi.fn(),
  handleSubmitReject: vi.fn(),
  handleSubmitValid: vi.fn(),
};

vi.mock('./hooks/useDetailsPanel', () => ({
  useDetailsPanel: () => useDetailsPanelMock,
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: currentPagePermissionsMock }),
}));

vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ children, disabled, onClick }: any) => (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('@/app/components/CollapsibleSection/CollapsibleSection', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/app/components/DynamicForm/DynamicForm', () => ({
  __esModule: true,
  default: () => <div>DynamicForm</div>,
}));

vi.mock('@/app/components/PopUp/PopUp', () => ({
  PopUp: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/app/components/Select/Select', () => ({
  Select: ({ label, selected, placeholder }: any) => (
    <div>
      {label ? <span>{label}</span> : null}
      <span>{selected?.[0] || placeholder}</span>
    </div>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/main-page/accounting/invoices/sat',
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
  it('muestra el tipo de gasto inicial desde json_sap en la ruta SAT', () => {
    useDetailsPanelMock.expenseTypeCatalog = [
      {
        id: '1',
        satKey: '90101500',
        descriptionSatKey: 'Consumo de Alimentos',
        internalKey: '162',
        descriptionInternalKey: 'Alimentos',
        gtStype: 'Viajes',
        iva: 16,
      },
      {
        id: '2',
        satKey: '90101501',
        descriptionSatKey: 'Hospedaje',
        internalKey: '138',
        descriptionInternalKey: 'Hospedaje',
        gtStype: 'Hospedaje',
        iva: 16,
      },
    ];

    const setPanelOpen = vi.fn();
    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={setPanelOpen}
        selected={{
          billingdocument_id: 'doc-1',
          requisition: { requisitionkey: 'REQ-1' },
          uuid: 'uuid-1',
          fecha: '2025-05-25 T 16:58:36',
          rfc_emisor: 'AAA010101AAA',
          rfc_receptor: 'BBB010101BBB',
          subtotal: 10,
          iva: 1.6,
          otherinvoices: 0,
          total: 11.6,
          user_comments: '',
          comments: '',
          conceptos: [],
          json_sap: {
            expenseType: '162',
            items: [
              {
                itemIndex: 1,
                claveInterna: '162',
                claveProdServ: '90101500',
                descripcion: 'Consumo de Alimentos',
                importe: 11.6,
              },
            ],
          },
        } as any}
        rejectType={false}
        operations={false}
      />,
    );
    expect(screen.getByText('Clave SAP')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('muestra labels del panel', () => {
    useDetailsPanelMock.expenseTypeCatalog = [];
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
    useDetailsPanelMock.expenseTypeCatalog = [];
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

