import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, it, expect, vi } from 'vitest'

import RequisitionDetailsDocument from './RequisitionDetailsDocument'

const dataTableMock = vi.fn(() => <div data-testid='row'>desc</div>)

vi.mock('./hooks/useRequisitionDetailsDocument', () => ({
  __esModule: true,
  default: () => ({
    rows: [
      {
        billingdocument_id: 'b1',
        description: 'desc',
        status: 'Pendiente',
        xmlUrl: 'https://example.com/file.xml',
        pdfUrl: 'https://example.com/file.pdf',
        imageUrl: 'https://example.com/file.jpg',
      },
    ],
    selected: null,
    panelOpen: false,
    downloadRequistionResume: vi.fn(),
    handleOpenDetails: vi.fn(),
    setPanelOpen: vi.fn(),
    requisitionId: '1',
    loading: false,
    downloadingDocument: false,
  }),
}))

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: (props: any) => dataTableMock(props),
}))

vi.mock('@/app/components/LoadingOverLay/LoadingOverlay', () => ({
  default: () => null,
}))

vi.mock('@/app/main-page/accounting/invoices/validateinvoices/components/DetailsPanel/DetailsPanel', () => ({
  __esModule: true,
  default: () => null,
}))

vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ children, iconOnly: _iconOnly, hideIcon: _hideIcon, icon: _icon, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { downloadDocuments: true } }),
}))

describe('RequisitionDetailsDocument', () => {
  beforeEach(() => {
    dataTableMock.mockClear()
  })

  it('renders rows from hook', () => {
    render(<RequisitionDetailsDocument />)
    expect(screen.getByTestId('row')).toHaveTextContent('desc')
  })

  it('renders file action icons for xml, pdf and image rows', () => {
    render(<RequisitionDetailsDocument />)

    const columns = dataTableMock.mock.calls[0][0].tables[0].columns
    const row = dataTableMock.mock.calls[0][0].tables[0].data[0]

    render(<>{columns[0].render(row)}</>)

    expect(screen.getByRole('button', { name: 'Abrir XML' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abrir PDF' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abrir Imagen' })).toBeInTheDocument()
  })
})
