import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import SideMenu from './SideMenu';

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

describe('Treasury Control SideMenu', () => {
  const formatDate = (date?: string) => date ?? '';
  const formatMoney = (value?: number) => (typeof value === 'number' ? `$${value}` : '$0');

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
    isValidating: false,
    isRejecting: false,
  } as const;

  it('opens the rejection modal, closes the panel, and validates the comment', () => {
    const onReject = vi.fn();
    const setPanelOpen = vi.fn();
    render(
      <SideMenu
        {...baseProps}
        onReject={onReject}
        setPanelOpen={setPanelOpen}
      />,
    );

    expect(screen.queryByText('Rechazar Vale')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Rechazar'));

    expect(setPanelOpen).toHaveBeenCalledWith(false);
    expect(screen.getByText('Rechazar Vale')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Enviar Comentario'));

    expect(onReject).not.toHaveBeenCalled();
    expect(screen.getByText('Agrega un comentario para continuar.')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('reject-comment'), {
      target: { value: 'Falta información' },
    });

    fireEvent.click(screen.getByText('Enviar Comentario'));

    expect(onReject).toHaveBeenCalledWith(baseProps.selected, 'Falta información');
    expect(screen.queryByText('Rechazar Vale')).not.toBeInTheDocument();
  });
});
