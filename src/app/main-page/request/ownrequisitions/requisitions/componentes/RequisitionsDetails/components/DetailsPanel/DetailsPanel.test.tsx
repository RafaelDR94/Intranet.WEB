import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import DetailsPanel from './DetailsPanel';

import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types';
import type { Requisition } from '@/app/mappings/requisitions/requisitions.types';

const useDetailsPanel = vi.fn();
const DownloadFile = vi.fn();

vi.mock('./hooks/useDetailsPanel', () => ({
  useDetailsPanel: () => useDetailsPanel(),
}));

vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
}));

vi.mock('@/app/components/DetailsPanelLayout/DetailsPanelLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ children }: { children?: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

vi.mock('@/app/components/PopUp/PopUp', () => ({
  PopUp: ({
    open,
    children,
  }: {
    open: boolean;
    children?: React.ReactNode;
  }) => (open ? <div>{children}</div> : null),
}));

vi.mock('@/app/components/DynamicForm/DynamicForm', () => ({
  __esModule: true,
  default: () => <div>DynamicFormMock</div>,
}));

vi.mock('@/app/utilities/FilesHelper/FilesHelper', () => ({
  DownloadFile: (...args: Parameters<typeof DownloadFile>) => DownloadFile(...args),
}));

const requisition: Requisition = {
  billingrequisition_id: 'req-1',
  requisitionkey: 'RQ-1',
  id_Employee: 'emp-1',
  employeename: 'Jane Doe',
  idProject: 'proj-1',
  projectname: 'Project 1',
  assignmentdate: '2025-01-01',
  endDate: '2025-01-02',
  motive: 'Work',
  state: 'active',
  status: 'pending',
  amountdeposited: '100',
  provenamount: '50',
  amountdifference: '50',
  date_created: '2025-01-01',
  gts_type: 'A',
  email: 'jane@example.com',
  phone_number: '123',
  period: '2025-01',
  current_days: 1,
  billingDocumentRquisition: [],
};

const selectedTicket: BillingDocuments = {
  id: 'doc-1',
  billingdocument_id: 'ticket-1',
  requisition,
  billingimages_id: 'img-1',
  xml: '',
  pdf: '',
  image: 'http://example.com/image.jpg',
  status: 'rechazado',
  comments: 'Comentario',
  rfc_emisor: 'RFC1',
  rfc_receptor: 'RFC2',
  conceptos: [],
  uuid: 'uuid-1',
  fecha: '2025-01-01',
  xmlinformation: '',
  date_created: '2025-01-01',
  user_comments: '',
  forbidden_code: false,
  sat_validation: false,
  billingAcuse: null,
  description: { id_billingdescription: 'desc-1', name: 'Desc' },
  numpersons: 1,
  numnights: 1,
  total: 100,
  subtotal: 80,
  iva: 20,
  otherinvoices: 0,
  category: { id_billingcategory: 'cat-1', name: 'Cat' },
  validatedbyoperations: false,
};

describe('DetailsPanel (Personal Invoices)', () => {
  it('shows empty state when no selection', () => {
    useDetailsPanel.mockReturnValue({
      labels: {},
      handleSubmitComment: vi.fn(),
      openValidInvoice: false,
      openRejectInvoice: false,
      setOpenValidInvoice: vi.fn(),
      setOpenRejectInvoice: vi.fn(),
      handleSubmitReject: vi.fn(),
      handleSubmitValid: vi.fn(),
      submitRef: { current: null },
    });

    render(
      <DetailsPanel panelOpen={true} setPanelOpen={vi.fn()} selected={null} />,
    );

    expect(
      screen.getByText('Selecciona un registro para ver el detalle.'),
    ).toBeInTheDocument();
  });

  it('renders document details when selected is present', () => {
    useDetailsPanel.mockReturnValue({
      labels: { left: 'Left', right: 'Right' },
      handleSubmitComment: vi.fn(),
      openValidInvoice: false,
      openRejectInvoice: false,
      setOpenValidInvoice: vi.fn(),
      setOpenRejectInvoice: vi.fn(),
      handleSubmitReject: vi.fn(),
      handleSubmitValid: vi.fn(),
      submitRef: { current: null },
    });

    render(
      <DetailsPanel
        panelOpen={true}
        setPanelOpen={vi.fn()}
        selected={selectedTicket}
      />,
    );

    expect(screen.getByText(selectedTicket.uuid)).toBeInTheDocument();
    expect(screen.getByText('Dejar comentario')).toBeInTheDocument();
  });
});
