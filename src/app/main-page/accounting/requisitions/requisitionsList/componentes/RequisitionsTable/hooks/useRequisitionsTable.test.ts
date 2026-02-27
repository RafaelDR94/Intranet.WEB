import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { useRequisitionTable } from './useRequisitionsTable'

vi.mock('@/tutorials/engine/TutorialProvider', () => ({
  __esModule: true,
  useTutorials: () => ({ activeTutorialId: null }),
}))

// Mocks necesarios para evitar undefined en path y searchParams
const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/main-page/accounting/requisitions/', // con slash final para probar el slice
  // Reproduce bien la API que usas en el hook (has, toString)
  useSearchParams: () => new URLSearchParams('x=1'),
}))

vi.mock('@/app/stores/system/useIntranetGatewayStore', () => ({
  useIntranetGatewayStore: () => true,
}))

vi.mock('@/app/stores/useBillingRequisitionWithEmployeesStore/useBillingRequisitionWithEmployeesStore', () => ({
  useBillingRequisitionWithEmployeesStore: (sel: any) => sel({
    requisitions: [{
      billingrequisition_id: '1',
      requisitionkey: 'REQ-1',
      employeename: 'John Doe',
      projectname: 'PRJ-1',
      date_created: '2025-01-01',
      id_Employee: 'emp1',
      idProject: 'pr1',
      amountdeposited: 1200,
      assignmentdate: '2025-01-01',
      endDate: '2025-01-05',
      phone_number: '555-1234',
      email: 'john@example.com',
    }],
    loading: false,
    error: undefined,
    removing: false,
    successGet: false,
    successDelete: false,
    fetchRequisitionsWithEmployees: vi.fn(),
    deleteRequisition: vi.fn().mockResolvedValue(true),
    resetFlags: vi.fn(),
  }),
}))

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
  }),
}))

describe('useRequisitionTable', () => {
  it('filters rows based on query', () => {
    const { result } = renderHook(() => useRequisitionTable())
    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0].employeename).toBe('John Doe')
    act(() => result.current.setQuery('no match'))
    expect(result.current.rows).toHaveLength(0)
  })

  it('navigates on edit with correct URL', () => {
    const { result } = renderHook(() => useRequisitionTable())
    act(() => result.current.onEdit({
      id: '1',
      snCode: 'REQ-1',
      debtorName: 'John Doe',
      projectCode: 'PRJ-1',
      date_created: '2025-01-01',
    } as any))
    // Se esperaba: limpia el slash final y agrega ?x=1&id=1
    expect(push).toHaveBeenCalledWith('/main-page/accounting/requisitions?x=1&id=1')
  })

  it('sets row to delete and opens confirmation', () => {
    const { result } = renderHook(() => useRequisitionTable())
    act(() => result.current.onDelete({ id: '1', snCode: 'REQ-1' } as any))
    expect(result.current.confirmOpen).toBe(true)
    expect(result.current.rowToDelete?.id).toBe('1')
  })
})
