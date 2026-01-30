import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import BillableFilesPage from './page';

const TicketForm = vi.hoisted(() =>
  vi.fn(() => <div>TicketFormMock</div>),
);
const InvoicesForm = vi.hoisted(() =>
  vi.fn(() => <div>InvoicesFormMock</div>),
);
const InvoicesProvider = vi.hoisted(
  () =>
    ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
);

vi.mock(
  '../../personalInvoices/invoices/components/TicketForm/TicketForm',
  () => ({
    __esModule: true,
    default: TicketForm,
  }),
);

vi.mock(
  '../../personalInvoices/invoices/components/InvoicesForm/InvoicesForm',
  () => ({
    __esModule: true,
    default: InvoicesForm,
  }),
);

vi.mock('../../personalInvoices/invoices/context/InvoicesContext', () => ({
  InvoicesProvider,
}));

describe('BillableFilesPage', () => {
  it('renders ticket and invoice forms within provider', () => {
    render(<BillableFilesPage />);

    expect(screen.getByText('TicketFormMock')).toBeInTheDocument();
    expect(screen.getByText('InvoicesFormMock')).toBeInTheDocument();
    expect(TicketForm).toHaveBeenCalled();
    expect(InvoicesForm).toHaveBeenCalled();
    expect(InvoicesForm.mock.calls[0][0].withoutName).toBe(true);
  });
});
