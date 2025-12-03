import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import RequisitionsFiles from './RequisitionsFiles'

vi.mock(
  '@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsTable/hooks/useRequisitionsTable',
  () => ({
    useRequisitionTable: () => ({
      rows: [
        {
          id: '1',
          snCode: 'SN-01',
          debtorName: 'John Doe',
          projectCode: 'PR-01',
          assignmentDate: '2025-01-01',
          dueDate: '2025-01-02',
          status: 'validación',
          date_created: '2025-01-01',
        },
      ],
      setQuery: vi.fn(),
      refresh: vi.fn(),
      hasIdParam: false,
      onEdit: vi.fn(),
      onDelete: vi.fn(),
    }),
  }),
)

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: ({ tables }: any) => (
    <div>
      <div>DataTable</div>
      <div>{tables?.[0]?.title}</div>
      <div>{tables?.[0]?.data?.[0]?.snCode}</div>
      <div>{tables?.[0]?.columns?.map((col: any) => String(col.key)).join(',')}</div>
    </div>
  ),
}))

vi.mock(
  '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery',
  () => ({
    useIsMobile: () => false,
  }),
)

describe('RequisitionsFiles', () => {
  it('renders requisitions history table with rows', () => {
    render(<RequisitionsFiles />)

    expect(screen.getByText('DataTable')).toBeInTheDocument()
    expect(screen.getByText('Historial')).toBeInTheDocument()
    expect(screen.getByText('SN-01')).toBeInTheDocument()
    expect(screen.getByText(/actions/)).toBeInTheDocument()
  })
})
