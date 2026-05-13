import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import DocumentsByRequisition from './DocumentsByRequisition'

const dataTableMock = vi.fn(() => <div data-testid="table" />)
const useIsMobileMock = vi.fn(() => false)

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === 'id' ? 'req-1' : null),
  }),
}))

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: (props: any) => dataTableMock(props),
}))

vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => useIsMobileMock(),
}))

vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

vi.mock('@/app/components/Label/Label', () => ({
  default: ({ text }: any) => <span>{text}</span>,
}))

vi.mock('@/app/components/LoadingOverLay/LoadingOverlay', () => ({
  default: () => null,
}))

vi.mock('../DetailsPanel/DetailsPanel', () => ({
  __esModule: true,
  default: () => null,
}))

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert: vi.fn() },
  }),
}))

vi.mock('@/app/stores/useBillingAllDocumentsByRequisitionStore/useBillingAllDocumentsByRequisitionStore', () => ({
  useBillingAllDocumentsByRequisitionStore: (selector: any) =>
    selector({
      billingDocumentByRequisition: {
        billingdocument_id: 'doc-1',
        billingimages_id: 'img-1',
        xml: 'https://example.com/doc.xml',
        pdf: 'https://example.com/doc.pdf',
        image: 'https://example.com/doc.jpg',
        status: 'Validado',
        comments: 'ok',
        user_comments: '',
        rfc_emisor: 'AAA010101AAA',
        rfc_receptor: 'BBB010101BBB',
        conceptos: [],
        uuid: 'uuid-1',
        certification_date: '2026-05-01',
        date_created: '2026-05-01',
        xmlinformation: '',
        forbidden_code: false,
        sat_validation: true,
        billingAcuse: null,
        description: { id: 'desc-1', name: 'Hospedaje' },
        numpersons: 1,
        numnights: 1,
        total: 100,
        subtotal: 80,
        iva: 20,
        otherinvoices: 0,
        category: { id: 'cat-1', name: 'Hospedaje' },
        validatedbyoperations: true,
        authorization: null,
        requisition: { requisitionkey: 'REQ-1' },
      },
      loading: false,
      error: null,
      fetchBillingAllDocumentByRequisition: vi.fn(),
    }),
}))

describe('DocumentsByRequisition', () => {
  beforeEach(() => {
    dataTableMock.mockClear()
    useIsMobileMock.mockReturnValue(false)
  })

  it('uses full desktop columns by default', () => {
    render(<DocumentsByRequisition />)

    const columns = dataTableMock.mock.calls[0][0].tables[0].columns
    expect(columns).toHaveLength(6)
    expect(columns.map((column: any) => column.label)).toEqual([
      'ARCHIVOS',
      'FECHA',
      'CATEGORIA',
      'ESTATUS',
      'COMENTARIOS',
      'VER DETALLE',
    ])
  })

  it('uses compact mobile columns on small screens', () => {
    useIsMobileMock.mockReturnValue(true)

    render(<DocumentsByRequisition />)
    screen.getByTestId('table')

    const columns = dataTableMock.mock.calls[0][0].tables[0].columns
    expect(columns).toHaveLength(3)
    expect(columns.map((column: any) => column.label)).toEqual([
      'REPORTE',
      'ESTATUS',
      '',
    ])

    const row = dataTableMock.mock.calls[0][0].tables[0].data[0]
    render(<>{columns[0].render(row)}</>)
    expect(screen.getByText('uuid-1')).toBeInTheDocument()
    expect(screen.getByText('2026-05-01 - Hospedaje')).toBeInTheDocument()
  })
})
