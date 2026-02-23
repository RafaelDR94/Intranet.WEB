import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import SideMenu from './SideMenu';


beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(window, 'open').mockImplementation(() => null);
});
afterEach(() => {
  vi.clearAllMocks();
});

window.open = vi.fn();

vi.mock('@/app/components/DetailsPanelLayout/DetailsPanelLayout', () => ({
  __esModule: true,
  default: ({
    children,
    actionButton,
  }: {
    children: React.ReactNode;
    actionButton?: React.ReactNode;
  }) => (
    <div>
      <div>{actionButton}</div>
      <div>{children}</div>
    </div>
  ),
}));

vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ children, hideIcon: _hideIcon, ...props }: any) => (
    <button {...props} type={props.type ?? 'button'}>
      {children}
    </button>
  ),
}));

vi.mock('@/app/components/Label/Label', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

vi.mock('@/app/components/PopUp/PopUp', () => ({
  PopUp: ({
    open,
    title,
    content,
    children,
    showPrimaryButton,
    primaryButtonText,
    onPrimaryButtonClick,
    showSecondaryButton,
    secondaryButtonText,
    onSecondaryButtonClick,
  }: any) =>
    open ? (
      <div>
        <h2>{title}</h2>
        <p>{content}</p>
        {children}
        {showSecondaryButton ? (
          <button onClick={onSecondaryButtonClick} type="button">
            {secondaryButtonText}
          </button>
        ) : null}
        {showPrimaryButton ? (
          <button onClick={onPrimaryButtonClick} type="button">
            {primaryButtonText}
          </button>
        ) : null}
      </div>
    ) : null,
}));

vi.mock(
  '@/app/main-page/treasury/treasurypettycash/treasurycontrol/components/ControlCards/components/CollapsibleSection/CollapsibleSection',
  () => ({
    __esModule: true,
    default: ({
      children,
      title,
    }: {
      children: React.ReactNode;
      title: string;
    }) => (
      <div>
        <div>{title}</div>
        {children}
      </div>
    ),
  }),
);

describe('Treasury Control SideMenu', () => {
  const formatDate = (date?: string) => date ?? '';
  const formatMoney = (value?: number) =>
    typeof value === 'number' ? `$${value.toFixed(2)}` : '$0.00';

  const baseProps = {
    panelOpen: true,
    setPanelOpen: vi.fn(),
    selected: {
      id: '1',
      employeeName: 'Colaborador',
      applicationDate: '2025-09-30',
      provider: 'Proveedor',
      concept: 'Concepto',
      subtotal: 100,
      iva: 16,
      total: 116,
      voucherType: 'Vale rosa',
      VoucherLabelType: 'vale-rosa',
      status: 'Pendiente',
    },
    detail: null,
    isDetailLoading: false,
    formatDate,
    formatMoney,
    onValidate: vi.fn(),
    onReject: vi.fn(),
    onRejectAuthorizationEvidence: vi.fn(),
    onEditModeChange: vi.fn(),
    onSaveAmount: vi.fn(),
    isValidating: false,
    isRejecting: false,
    isEditingAmount: false,
    isSavingAmount: false,
    amountHistory: [],
    isHistoryLoading: false,
  } as const;

  const approvedAuthorization = {
    authorization_id: 'auth-1',
    status: 'Aprobada',
    authorizer: { fullname: 'Autoriza' },
  };

  it('opens the voucher rejection modal and validates the comment before submitting', () => {
    const onReject = vi.fn();
    render(
      <SideMenu
        {...baseProps}
        onReject={onReject}
        setPanelOpen={vi.fn()}
        detail={{
          id: '1',
          employeename: 'Colaborador',
          status: 'Pendiente',
          voucher_type: 'Vale rosa',
          application_date: '2025-09-30',
          concept: 'Concepto',
          amount: 150,
          total: 150,
          petty_cash_funds: {
            id: 'fund-1',
            year_month: '2025-09',
            assigned_amount: 0,
            verified_amount: 0,
            cash_on_hand: 0,
            unverified_amount: 0,
            pending_verification: 0,
            available_amount: 0,
          },
          project: { id: 'project-1', name: 'Proyecto', proyectkey: 'PRJ' },
          authorization: approvedAuthorization,
        } as any}
      />,
    );

    expect(screen.queryByText('Rechazar Vale')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('reject-voucher-button'));

    expect(screen.getByText('Rechazar Vale')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Enviar Comentario'));
    expect(onReject).not.toHaveBeenCalled();
    expect(
      screen.getByText('Agrega un comentario para continuar.'),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('reject-comment'), {
      target: { value: 'Falta información' },
    });

    fireEvent.click(screen.getByText('Enviar Comentario'));

    expect(onReject).toHaveBeenCalledWith(baseProps.selected, 'Falta información');
    expect(screen.queryByText('Rechazar Vale')).not.toBeInTheDocument();
  });

  it('opens the rejection modal from the voucher action and trims the submitted comment', async () => {
    const onReject = vi.fn();
    const onRejectAuthorizationEvidence = vi.fn();
    render(
      <SideMenu
        {...baseProps}
        onReject={onReject}
        onRejectAuthorizationEvidence={onRejectAuthorizationEvidence}
        detail={{
          id: '1',
          employeename: 'Colaborador',
          status: 'Pendiente',
          voucher_type: 'Vale rosa',
          application_date: '2025-09-30',
          concept: 'Concepto',
          amount: 150,
          total: 150,
          authorization_evidence: 'https://example.com/evidence.jpg',
          petty_cash_funds: {
            id: 'fund-1',
            year_month: '2025-09',
            assigned_amount: 0,
            verified_amount: 0,
            cash_on_hand: 0,
            unverified_amount: 0,
            pending_verification: 0,
            available_amount: 0,
          },
          project: { id: 'project-1', name: 'Proyecto', proyectkey: 'PRJ' },
          authorization: approvedAuthorization,
        } as any}
      />,
    );

    fireEvent.click(screen.getByTestId('reject-voucher-button'));

    await screen.findByText('Rechazar Vale');

    const textarea = screen.getByPlaceholderText('Escribir comentario');
    fireEvent.change(textarea, { target: { value: '   Comentario de evidencia   ' } });

    fireEvent.click(screen.getByText('Enviar Comentario'));

    await waitFor(() => {
      expect(onReject).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1' }),
        'Comentario de evidencia',
      );
    });

    expect(onRejectAuthorizationEvidence).not.toHaveBeenCalled();
  });

  it('toggles the editing flow and saves a new amount for valid vouchers', async () => {
    const onEditModeChange = vi.fn();
    const onSaveAmount = vi.fn().mockResolvedValue(undefined);

    const { rerender } = render(
      <SideMenu
        {...baseProps}
        selected={{ ...baseProps.selected, status: 'Validado' }}
        detail={{
          id: '1',
          employeename: 'Colaborador',
          status: 'Validado',
          amount: 150,
          total: 150,
          petty_cash_funds: {
            id: 'fund-1',
            year_month: '2025-09',
            assigned_amount: 0,
            verified_amount: 0,
            cash_on_hand: 0,
            unverified_amount: 0,
            pending_verification: 0,
            available_amount: 0,
          },
          employee_id: '1',
          voucher_type: 'Vale rosa',
          application_date: '2025-09-30',
          concept: 'Concepto',
          comments: '',
          project: { id: 'project-1', name: 'Proyecto', proyectkey: 'PRJ' },
        } as any}
        onEditModeChange={onEditModeChange}
        onSaveAmount={onSaveAmount}
      />,
    );

    rerender(
      <SideMenu
        {...baseProps}
        selected={{ ...baseProps.selected, status: 'Validado' }}
        detail={{
          id: '1',
          employeename: 'Colaborador',
          status: 'Validado',
          amount: 150,
          total: 150,
          petty_cash_funds: {
            id: 'fund-1',
            year_month: '2025-09',
            assigned_amount: 0,
            verified_amount: 0,
            cash_on_hand: 0,
            unverified_amount: 0,
            pending_verification: 0,
            available_amount: 0,
          },
          employee_id: '1',
          voucher_type: 'Vale rosa',
          application_date: '2025-09-30',
          concept: 'Concepto',
          comments: '',
          project: { id: 'project-1', name: 'Proyecto', proyectkey: 'PRJ' },
        } as any}
        onEditModeChange={onEditModeChange}
        onSaveAmount={onSaveAmount}
        isEditingAmount
      />,
    );

    const input = screen.getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '250.50' } });
    fireEvent.click(screen.getByText('Guardar Monto'));

    expect(
      screen.getByText(
        'Confirma que deseas actualizar el monto solicitado a $250.50.',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(onSaveAmount).toHaveBeenCalledWith(250.5);
    });
  });

  it('shows the requested amount as total for blue vouchers when the invoice total is zero', () => {
    render(
      <SideMenu
        {...baseProps}
        selected={{
          ...baseProps.selected,
          voucherType: 'Vale azul',
          VoucherLabelType: 'vale-azul',
          total: 0,
        }}
        detail={{
          id: '1',
          petty_cash_funds: {
            id: 'fund-1',
            year_month: '2025-09',
            assigned_amount: 0,
            verified_amount: 0,
            cash_on_hand: 0,
            unverified_amount: 0,
            pending_verification: 0,
            available_amount: 0,
          },
          employee_id: '1',
          employeename: 'Colaborador',
          status: 'Pendiente',
          voucher_type: 'Vale azul',
          application_date: '2025-09-30',
          concept: 'Concepto',
          amount: 150,
          comments: '',
          project: { id: 'project-1', name: 'Proyecto', proyectkey: 'PRJ' },
          xml: '',
          pdf: '',
          uuid: '',
          rfc_emisor: '',
          rfc_receptor: '',
          subtotal: 0,
          iva: 0,
          total: 0,
          conceptos: [],
        } as any}
      />,
    );

    expect(screen.getByText('$150.00')).toBeInTheDocument();
  });

  it('renders the amount history when entries are provided', () => {
    render(
      <SideMenu
        {...baseProps}
        selected={{ ...baseProps.selected, status: 'Validado' }}
        detail={{
          id: '1',
          petty_cash_funds: {
            id: 'fund-1',
            year_month: '2025-09',
            assigned_amount: 0,
            verified_amount: 0,
            cash_on_hand: 0,
            unverified_amount: 0,
            pending_verification: 0,
            available_amount: 0,
          },
          employee_id: '1',
          employeename: 'Colaborador',
          status: 'Validado',
          voucher_type: 'Vale rosa',
          application_date: '2025-09-30',
          concept: 'Concepto',
          amount: 150,
          total: 150,
          comments: '',
          project: { id: 'project-1', name: 'Proyecto', proyectkey: 'PRJ' },
          xml: '',
          pdf: '',
          uuid: '',
          rfc_emisor: '',
          rfc_receptor: '',
          subtotal: 0,
          iva: 0,
          conceptos: [],
        } as any}
        amountHistory={[
          { date: '2024-03-15T12:00:00.000Z', amount: 1800 },
          { date: '2024-02-10T12:00:00.000Z', amount: 1500 },
        ]}
      />,
    );

    const history = screen.getByTestId('amount-history');
    expect(history).toBeInTheDocument();
    expect(history.textContent).toContain('$1800.00');
  });
});
