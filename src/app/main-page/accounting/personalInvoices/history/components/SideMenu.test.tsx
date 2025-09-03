import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import SideMenu from './SideMenu';

vi.mock('@/app/components/DetailsPanelLayout/DetailsPanelLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../invoices/components/TicketForm/TicketForm', () => ({
  __esModule: true,
  default: () => <div>TicketFormMock</div>,
}));
vi.mock('../../invoices/components/InvoicesForm/InvoicesForm', () => ({
  __esModule: true,
  default: () => <div>InvoicesFormMock</div>,
}));
vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
vi.mock('@/app/components/Label/Label', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ user: { fullName: 'User' }, currentPagePermissions: { canAddPicture: true, canAddDocuments: true, canSeeDetails: true } }),
}));

const selected = {
  requisitionkey: 'R1',
  project: { name: 'Proj' },
  status: 'Rechazado',
} as any;

describe('SideMenu', () => {
  it('renders placeholder when no selection', () => {
    render(<SideMenu panelOpen={true} setPanelOpen={vi.fn()} selected={null} />);
    expect(screen.getByText('Selecciona un registro para ver el detalle.')).toBeInTheDocument();
  });

  it('renders details when selection provided', () => {
    render(<SideMenu panelOpen={true} setPanelOpen={vi.fn()} selected={selected} />);
    expect(screen.getByText('TicketFormMock')).toBeInTheDocument();
  });
});
