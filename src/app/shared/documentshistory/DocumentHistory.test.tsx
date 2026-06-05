import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { DocumentHistory } from './DocumentHistory'

vi.mock('@/assets/icons/System/System/calendar.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/organization/filter-alt.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/organization/search.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/organization/chevron-down.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/navegacion/nav-arrow-up.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/acciones/refresh-double.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/Docs/page.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/Docs/privacy policy.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/Fotos y Videos/media-image.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/acciones/cancel.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/navegacion/sidebar-collapse.svg', () => ({ default: () => <span /> }))
vi.mock('@/assets/icons/navegacion/sidebar-expand.svg', () => ({ default: () => <span /> }))
vi.mock('@/app/components/Calendar/Calendar', () => ({
  Calendar: () => <button type="button">calendar</button>,
}))
vi.mock('@/app/components/Pagination/Pagination', () => ({
  default: () => <div>pagination</div>,
}))
vi.mock('@/app/components/Filter/Filter', () => ({
  default: () => <button type="button">filter</button>,
}))

vi.mock('./hooks/useDocumentHistory', async () => {
  const ReactModule = await import('react')

  return {
    useDocumentHistory: () => {
      const [detailOpen, setDetailOpen] = ReactModule.useState(false)
      const row = {
        id: 'doc-1',
        employeeName: 'Maria Gonzalez',
        companyName: 'DRS',
        projectName: 'Atlas',
        requisitionCode: 'REQ-001',
        uuid: 'UUID-001',
        status: 'Validado',
        xmlUrl: '/xml',
        pdfUrl: '/pdf',
        imageUrl: '/image',
      }
      const detail = {
        ...row,
        certificationDate: '2026-06-01T10:00:00Z',
        rfcEmisor: 'AAA010101AAA',
        rfcReceptor: 'BBB010101BBB',
        subtotal: 100,
        iva: 16,
        total: 116,
        comments: 'Documento revisado',
        userComments: '',
        concepts: [
          {
            id: 'concept-1',
            satKey: '01010101',
            description: 'Hospedaje',
          },
        ],
      }

      return {
        columns: [
          { key: 'employeeName', label: 'Nombre' },
          { key: 'companyName', label: 'Empresa' },
          { key: 'projectName', label: 'Proyecto' },
          { key: 'requisitionCode', label: 'Requisicion' },
          { key: 'uuid', label: 'UUID' },
          { key: 'status', label: 'Estatus' },
          {
            key: 'id',
            label: 'Ver factura',
            render: () => (
              <button type="button" onClick={() => setDetailOpen(true)}>
                Ver factura
              </button>
            ),
          },
        ],
        rows: [row],
        currentPage: 1,
        pageSize: 12,
        totalRows: 1,
        filterOptions: [{ label: 'Todos', value: 'all' }],
        filterValue: 'all',
        loadingList: false,
        loadingDetail: false,
        error: undefined,
        integrationPendingList: false,
        integrationPendingDetail: false,
        detailOpen,
        selectedDetail: detailOpen ? detail : null,
        selectedRow: row,
        handleSearchChange: vi.fn(),
        handleFilterChange: vi.fn(),
        handlePageChange: vi.fn(),
        refresh: vi.fn(),
        closeDetails: () => setDetailOpen(false),
        openDetails: vi.fn(),
      }
    },
  }
})

describe('DocumentHistory', () => {
  it('renders the expected columns without selection controls', () => {
    render(<DocumentHistory scope="accounting" />)

    expect(screen.getByText('NOMBRE')).toBeInTheDocument()
    expect(screen.getByText('EMPRESA')).toBeInTheDocument()
    expect(screen.getByText('PROYECTO')).toBeInTheDocument()
    expect(screen.getByText('REQUISICION')).toBeInTheDocument()
    expect(screen.getByText('UUID')).toBeInTheDocument()
    expect(screen.getByText('ESTATUS')).toBeInTheDocument()
    expect(screen.getByText('VER FACTURA')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).toBeNull()
  })

  it('opens the read-only details panel when clicking Ver factura', () => {
    render(<DocumentHistory scope="operations" />)

    fireEvent.click(screen.getAllByText('Ver factura')[0])

    expect(screen.getByText(/RFC EMISOR/i)).toBeInTheDocument()
    expect(screen.getByText('AAA010101AAA')).toBeInTheDocument()
    expect(screen.getByText(/CLAVE SAT/i)).toBeInTheDocument()
    expect(screen.getByText('Hospedaje')).toBeInTheDocument()
  })
})
