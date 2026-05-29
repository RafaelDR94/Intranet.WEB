import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  handleUpdateJsonSapItem: vi.fn(async () => true),
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

vi.mock('@/app/components/Input/Input', () => ({
  Input: ({ as, label, value, onChange, onBlur, onKeyDown, helperText, disabled }: any) => (
    <label>
      <span>{label}</span>
      {as === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          readOnly={!onChange}
          disabled={disabled}
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          readOnly={!onChange}
          disabled={disabled}
        />
      )}
      {helperText ? <span>{helperText}</span> : null}
    </label>
  ),
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
  const longDescription =
    'Descripcion extremadamente larga para validar que el usuario pueda corregirla antes de enviar a SAP y que el sistema marque el error cuando supere el limite permitido.';

  it('renderiza impuestos e importe editable desde json_sap en la ruta SAT', () => {
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
                importe: '11.6',
                importeImpuesto: '1.86',
                impuesto: '2',
                tasaCuota: '0.16',
              },
            ],
          },
        } as any}
        rejectType={false}
        operations={false}
      />,
    );
    expect(screen.getByText('Clave SAP')).toBeInTheDocument();
    expect(screen.getByText('Impuesto:')).toBeInTheDocument();
    expect(screen.getByText('TasaCuota:')).toBeInTheDocument();
    expect(screen.getByText('ImporteImpuesto:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11.6')).toBeInTheDocument();
    expect(screen.queryByText('Editar descripcion')).not.toBeInTheDocument();
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
            items: [
              {
                itemIndex: 1,
                claveInterna: '',
                claveProdServ: '90101501',
                importe: '10',
                importeImpuesto: '1.6',
                impuesto: '2',
                tasaCuota: '0.16',
              },
            ],
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

  it('deshabilita Enviar a SAP cuando el importe es negativo', () => {
    useDetailsPanelMock.expenseTypeCatalog = [];
    const setPanelOpen = vi.fn();
    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={setPanelOpen}
        selected={{
          billingdocument_id: 'doc-2',
          json_sap: {
            items: [
              {
                itemIndex: 1,
                claveInterna: '138',
                claveProdServ: '90101501',
                descripcion: 'Descripcion corta',
                importe: '-1',
                importeImpuesto: '1.6',
                impuesto: '2',
                tasaCuota: '0.16',
              },
            ],
          },
        } as any}
        rejectType={false}
        operations={false}
        sendInvoiceToSap
        onSendToSap={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Enviar a SAP' })).toBeDisabled();
    expect(
      screen.queryByText('Captura un importe valido mayor o igual a 0 con maximo 2 decimales.'),
    ).not.toBeInTheDocument();
  });

  it('permite editar la descripcion cuando excede 120 caracteres y bloquea Enviar a SAP', () => {
    useDetailsPanelMock.expenseTypeCatalog = [];
    const setPanelOpen = vi.fn();

    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={setPanelOpen}
        selected={{
          billingdocument_id: 'doc-2c',
          json_sap: {
            items: [
              {
                itemIndex: 1,
                claveInterna: '138',
                claveProdServ: '90101501',
                descripcion: longDescription,
                importe: '150.45',
                importeImpuesto: '24.07',
                impuesto: '2',
                tasaCuota: '0.16',
              },
            ],
          },
        } as any}
        rejectType={false}
        operations={false}
        sendInvoiceToSap
        onSendToSap={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue(longDescription)).toBeInTheDocument();
    expect(
      screen.getByText(/La descripcion no puede exceder 120 caracteres/),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar a SAP' })).toBeDisabled();
  });

  it('habilita Enviar a SAP en no deducibles aunque falte claveInterna en json_sap', () => {
    useDetailsPanelMock.expenseTypeCatalog = [];
    const setPanelOpen = vi.fn();
    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={setPanelOpen}
        selected={{
          billingdocument_id: 'doc-1',
          json_sap: {
            items: [
              {
                itemIndex: 1,
                claveInterna: '',
                claveProdServ: '90101501',
                importe: '10',
                importeImpuesto: '1.6',
                impuesto: '2',
                tasaCuota: '0.16',
              },
            ],
          },
        } as any}
        rejectType={false}
        operations={false}
        sendInvoiceToSap
        bypassSendToSapValidation
        onSendToSap={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Enviar a SAP' })).toBeEnabled();
  });

  it('guarda la descripcion corregida y habilita Enviar a SAP cuando queda dentro del limite', async () => {
    useDetailsPanelMock.expenseTypeCatalog = [];
    useDetailsPanelMock.handleUpdateJsonSapItem.mockResolvedValueOnce(true);
    const setPanelOpen = vi.fn();

    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={setPanelOpen}
        selected={{
          billingdocument_id: 'doc-2d',
          json_sap: {
            items: [
              {
                itemIndex: 1,
                claveInterna: '138',
                claveProdServ: '90101501',
                descripcion: longDescription,
                importe: '150.45',
                importeImpuesto: '24.07',
                impuesto: '2',
                tasaCuota: '0.16',
              },
            ],
          },
        } as any}
        rejectType={false}
        operations={false}
        sendInvoiceToSap
        onSendToSap={vi.fn()}
      />,
    );

    const textarea = screen.getByDisplayValue(longDescription);
    const validDescription = 'Descripcion corregida para SAP';

    fireEvent.change(textarea, { target: { value: validDescription } });
    fireEvent.blur(textarea);

    await waitFor(() => {
      expect(useDetailsPanelMock.handleUpdateJsonSapItem).toHaveBeenCalledWith(0, {
        descripcion: validDescription,
      });
    });
    expect(screen.getByRole('button', { name: 'Enviar a SAP' })).toBeEnabled();
  });

  it('habilita Enviar a SAP cuando el importe tiene mas de 2 decimales', () => {
    useDetailsPanelMock.expenseTypeCatalog = [];
    const setPanelOpen = vi.fn();
    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={setPanelOpen}
        selected={{
          billingdocument_id: 'doc-2b',
          json_sap: {
            items: [
              {
                itemIndex: 1,
                claveInterna: '138',
                claveProdServ: '90101501',
                descripcion: 'Descripcion larga',
                importe: '150.4567',
                importeImpuesto: '1.6',
                impuesto: '2',
                tasaCuota: '0.16',
              },
            ],
          },
        } as any}
        rejectType={false}
        operations={false}
        sendInvoiceToSap
        onSendToSap={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Enviar a SAP' })).toBeEnabled();
  });

  it('habilita Enviar a SAP cuando no hay warning y todas las claves SAP estan completas', () => {
    useDetailsPanelMock.expenseTypeCatalog = [];
    const setPanelOpen = vi.fn();
    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={setPanelOpen}
        selected={{
          billingdocument_id: 'doc-3',
          json_sap: {
            items: [
              {
                itemIndex: 1,
                claveInterna: '138',
                claveProdServ: '90101501',
                descripcion: 'Corto',
                importe: '150.45',
                importeImpuesto: '24.07',
                impuesto: '2',
                tasaCuota: '0.16',
              },
            ],
          },
        } as any}
        rejectType={false}
        operations={false}
        sendInvoiceToSap
        onSendToSap={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Enviar a SAP' })).toBeEnabled();
  });
});

