import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

import RequisitionsTable from './RequisitionsTable'

const mockHook = vi.fn().mockReturnValue({
  rows: [{ id: '1', snCode: 'REQ-1', debtorName: 'John', projectCode: 'PRJ-1', date_created: '2025-01-01' }],
  setQuery: vi.fn(),
  confirmOpen: false,
  rowToDelete: null,
  removing: false,
  handleConfirmDelete: vi.fn(),
  setConfirmOpen: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  refresh: vi.fn(),
})

vi.mock('./hooks/useRequisitionsTable', () => ({
  useRequisitionTable: () => mockHook(),
}))

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: ({ tables }: any) => <div data-testid="table">{tables[0].data[0].snCode}</div>,
}))

vi.mock('@/app/components/PopUp/PopUp', () => ({
  PopUp: ({ title }: any) => <div>{title}</div>,
}))
vi.mock('@/app/components/Button/Button', () => ({ Button: () => <button /> }))
vi.mock('@/app/components/ContextMenu/ContextMenu', () => ({ ContextMenu: ({ trigger }: any) => <div>{trigger}</div> }))
vi.mock('@/assets/icons/navegacion/more-horiz.svg', () => ({ default: () => <svg /> }))
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { read: true, update: true, delete: true } }),
}));

describe('RequisitionsTable', () => {
  it('renders rows from hook', () => {
    render(<RequisitionsTable onEditRequest={() => {}} />)
    expect(screen.getByTestId('table')).toHaveTextContent('REQ-1')
  })

  it('shows confirmation popup when hook flag is true', () => {
    mockHook.mockReturnValueOnce({
      rows: [{ id: '1', snCode: 'REQ-1', debtorName: 'John', projectCode: 'PRJ-1', date_created: '2025-01-01' }],
      setQuery: vi.fn(),
      confirmOpen: true,
      rowToDelete: { id: '1', snCode: 'REQ-1' },
      removing: false,
      handleConfirmDelete: vi.fn(),
      setConfirmOpen: vi.fn(),
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      refresh: vi.fn(),
    })
    render(<RequisitionsTable onEditRequest={() => {}} />)
    expect(screen.getByText('¿Deseas eliminar el documento seleccionado?')).toBeInTheDocument()
  })
})
