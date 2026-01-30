import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import SideMenu from './SideMenu';

import type { ButtonProps } from '@/app/components/Button/types';
import type { HistoryRow } from '@/app/mappings/billinghistory/billinghistory.types';
import type { EmployeeType } from '@/app/mappings/employees/employee.types';

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
  Button: ({ children, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}));
vi.mock('@/app/components/Label/Label', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: { fullName: 'User' },
    currentPagePermissions: {
      canAddPicture: true,
      canAddDocuments: true,
      canSeeDetails: true,
    },
  }),
}));

const selected = {
  id: '1',
  billing_image_id: 'img-1',
  billingdocument_id: 'doc-1',
  project: {
    id: 'proj-1',
    name: 'Proj',
    proyectKey: 'PR-1',
    client: 'Client',
    manager: {} as EmployeeType,
    collaborators: [] as EmployeeType[],
  },
  requisitionkey: 'R1',
  status: 'valido',
  xml: '',
  pdf: '',
  image: '',
  comments: '',
  dateCreate: '2025-01-01',
  certificationDate: '2025-01-01',
  uuid: 'uuid-1',
  description: { id_billingdescription: 'desc-1', name: 'Desc' },
  category: { id_billingcategory: 'cat-1', name: 'Cat' },
  numpersons: 1,
  numnights: 1,
} as HistoryRow;

describe('SideMenu', () => {
  it('renders placeholder when no selection', () => {
    render(<SideMenu panelOpen={true} setPanelOpen={vi.fn()} selected={null} />);
    expect(screen.getByText('Selecciona un registro para ver el detalle.')).toBeInTheDocument();
  });

  it('renders details when selection provided', () => {
    render(<SideMenu panelOpen={true} setPanelOpen={vi.fn()} selected={selected} />);
    expect(screen.getByText('Código de Solicitud:')).toBeInTheDocument();
    expect(screen.getByText('R1')).toBeInTheDocument();
    expect(screen.getByText('TicketFormMock')).toBeInTheDocument();
  });
});
