import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useRequisitionTable } from './useRequisitionsTable'

const pushMock = vi.fn()
const fetchMock = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/main-page/operations/requisitions/requisitionListPage',
  useSearchParams: () => new URLSearchParams('label=Requisiciones%20Bruno'),
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: { idEmployee: 'emp-1' },
    currentPagePermissions: { details: true, update: true, delete: true },
  }),
}))

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
  }),
}))

vi.mock('@/app/stores/system/useIntranetGatewayStore', () => ({
  useIntranetGatewayStore: (selector: any) => selector({ isReady: false }),
}))

vi.mock('@/app/stores/useRequisitionStore/useRequisitionStore', () => ({
  useRequisitionsStore: (selector: any) =>
    selector({
      requisitions: [],
      loading: false,
      error: null,
      warning: null,
      removing: false,
      successPut: false,
      fetchRequisitionsByIdEmployee: fetchMock,
      deleteRequisition: vi.fn(),
      resetFlags: vi.fn(),
    }),
}))

describe('useRequisitionTable', () => {
  it('navega al tab de detalle y agrega label al consultar detalle', () => {
    const { result } = renderHook(() => useRequisitionTable())

    act(() => {
      result.current.onEdit({
        id: 'req-1',
        snCode: 'SN-01',
        debtorName: 'Juan Perez',
        projectCode: 'PR-1',
        assignmentDate: '2024-01-01',
        dueDate: '2024-01-02',
        amount: 100,
        status: 'validación',
        date_created: '2024-01-01',
        state: 'Nuevo',
      })
    })

    expect(pushMock).toHaveBeenCalledWith(
      '/main-page/operations/requisitions/requisitionListPage?label=Detalle+Juan+Perez&id=req-1',
    )
  })
})
