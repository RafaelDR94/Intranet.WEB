import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

import RequisitionsTable from './RequisitionsTable'

const actionMenuCellMock = vi.fn(() => <div data-testid="action-menu-cell" />)
const mockHook = vi.fn().mockReturnValue({
  rows: [
    {
      id: '1',
      snCode: 'REQ-1',
      requisitionkey: 'REQ-1',
      debtorName: 'John',
      employeeName: 'John',
      projectCode: 'PRJ-1',
      projectname: 'Proyecto 1',
      state: 'CDMX',
      period: '2025-01-01 - 2025-01-05',
      current_days: 3,
      date_created: '2025-01-01',
    },
  ],
  activeRows: [
    {
      id: '1',
      snCode: 'REQ-1',
      requisitionkey: 'REQ-1',
      debtorName: 'John',
      employeeName: 'John',
      projectCode: 'PRJ-1',
      projectname: 'Proyecto 1',
      state: 'CDMX',
      period: '2025-01-01 - 2025-01-05',
      current_days: 3,
      date_created: '2025-01-01',
    },
  ],
  setQuery: vi.fn(),
  confirmOpen: false,
  rowToDelete: null,
  removing: false,
  handleConfirmDelete: vi.fn(),
  setConfirmOpen: vi.fn(),
  onEdit: vi.fn(),
  handleOpenDetails: vi.fn(),
  onDelete: vi.fn(),
  refresh: vi.fn(),
  hasIdParam: false,
})

vi.mock('./hooks/useRequisitionsTable', () => ({
  useRequisitionTable: () => mockHook(),
}))

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: ({ tables }: any) => {
    const firstRow = tables?.[0]?.data?.[0]

    return (
      <div data-testid="table">
        <div>{firstRow?.projectname ?? 'no-data'}</div>
        {firstRow
          ? tables?.[0]?.columns?.map((column: any, index: number) => (
              <div key={String(column.key) || index}>
                {typeof column.render === 'function'
                  ? column.render(firstRow)
                  : null}
              </div>
            ))
          : null}
      </div>
    )
  },
}))

vi.mock('@/app/components/PopUp/PopUp', () => ({
  PopUp: ({ title }: any) => <div>{title}</div>,
}))
vi.mock('@/app/components/Button/Button', () => ({ Button: () => <button /> }))
vi.mock('@/app/components/ContextMenu/ContextMenu', () => ({ ContextMenu: ({ trigger }: any) => <div>{trigger}</div> }))
vi.mock('@/app/components/ActionMenuCell/ActionMenuCell', () => ({
  default: (props: any) => actionMenuCellMock(props),
}))
vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: vi.fn(() => false),
}))
vi.mock('@/assets/icons/navegacion/more-horiz.svg', () => ({ default: () => <svg /> }))
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { read: true, update: true, delete: true } }),
}));

describe('RequisitionsTable', () => {
  it('renders rows from hook', () => {
    render(<RequisitionsTable />)
    const tables = screen.getAllByTestId('table')
    expect(tables[0]).toHaveTextContent('Proyecto 1')
  })

  it('shows confirmation popup when hook flag is true', () => {
    mockHook.mockReturnValueOnce({
      rows: [{
        id: '1', snCode: 'REQ-1', requisitionkey: 'REQ-1', debtorName: 'John', employeeName: 'John', projectCode: 'PRJ-1', projectname: 'Proyecto 1', date_created: '2025-01-01', status: 'Activa',
      }],
      activeRows: [],
      setQuery: vi.fn(),
      confirmOpen: true,
      rowToDelete: { id: '1', requisitionkey: 'REQ-1', snCode: 'REQ-1' },
      removing: false,
      handleConfirmDelete: vi.fn(),
      setConfirmOpen: vi.fn(),
      onEdit: vi.fn(),
      handleOpenDetails: vi.fn(),
      onDelete: vi.fn(),
      refresh: vi.fn(),
      hasIdParam: false,
    })
    render(<RequisitionsTable />)
    expect(screen.getByText('¿Deseas eliminar el documento seleccionado?')).toBeInTheDocument()
  })

  it('passes explicit mobile permissions to action menu', async () => {
    const { useIsMobile } = await import('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery')
    vi.mocked(useIsMobile).mockReturnValue(true)

    render(<RequisitionsTable />)

    expect(actionMenuCellMock).toHaveBeenCalled()
    expect(actionMenuCellMock.mock.calls[0][0]).toMatchObject({
      permissions: { details: true, delete: true },
    })
  })
})
