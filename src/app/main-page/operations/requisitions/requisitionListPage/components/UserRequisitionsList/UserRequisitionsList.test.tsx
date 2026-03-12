import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import UserRequisitionsList from './UserRequisitionsList'

const fetchMock = vi.fn()
const resetMock = vi.fn()
const deleteMock = vi.fn(async () => true)
const pushMock = vi.fn()

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('id=99'),
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/main-page/operations/requisitions/requisitionListPage',
}))

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: {
      showSpinner: vi.fn(),
      hideSpinner: vi.fn(),
    },
    usePrincipalAlert: {
      showAlert: vi.fn(),
      hideAlert: vi.fn(),
    },
  }),
}))

vi.mock('@/app/stores/useRequisitionStore/useRequisitionStore', () => ({
  useRequisitionsStore: (selector: any) =>
    selector({
      requisitions: [
        {
          billingrequisition_id: '1',
          id_Employee: '99',
          requisitionkey: 'SN-01',
          employeename: 'John Doe',
          projectname: 'PR-01',
          assignmentdate: '2025-01-01',
          endDate: '2025-01-02',
          amountdeposited: '1500',
          status: 'validación',
          date_created: '2025-01-01',
          state: 'Activo',
        },
      ],
      loading: false,
      error: undefined,
      warning: undefined,
      removing: false,
      fetchRequisitionsByIdEmployee: fetchMock,
      deleteRequisition: deleteMock,
      resetFlags: resetMock,
    }),
}))

vi.mock('@/app/components/ActionMenuCell/ActionMenuCell', () => ({
  __esModule: true,
  default: () => <div>Actions</div>,
}))

vi.mock('@/app/components/PopUp/PopUp', () => ({
  __esModule: true,
  PopUp: ({ children }: any) => <div>{children}</div>,
}))

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

describe('UserRequisitionsList', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('renders requisitions history table with rows and fetches by user id', async () => {
    render(<UserRequisitionsList />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('99', true)
    })

    expect(screen.getByText('DataTable')).toBeInTheDocument()
    expect(screen.getByText('Historial')).toBeInTheDocument()
    expect(screen.getByText('SN-01')).toBeInTheDocument()
    expect(screen.getByText('debtorName,snCode,status,actions')).toBeInTheDocument()
  })
})
