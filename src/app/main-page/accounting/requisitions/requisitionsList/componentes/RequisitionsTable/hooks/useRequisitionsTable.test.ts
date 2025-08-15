
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useRequisitionTable } from './useRequisitionsTable'
import { fetchRequisitionsByDate } from '@/app/stores/useRequisitionStore/utilities'

const requisition = {
  billingrequisition_id: '1',
  requisitionkey: 'REQ-1',
  employeename: 'John Doe',
  projectname: 'PRJ-1',
  date_created: '2025-01-01',
  id_Employee: 'emp1',
  idProject: 'pr1',
}

vi.mock('@/app/stores/system/useIntranetGatewayStore', () => ({
  useIntranetGatewayStore: () => true,
}))

vi.mock('@/app/stores/useRequisitionStore/useRequisitionStore', () => ({
  useRequisitionsStore: (sel: any) => sel({
    requisitions: [requisition],
    loading: false,
    error: undefined,
    removing: false,
    fetchRequisitionsByDate: vi.fn(),
    deleteRequisition: vi.fn().mockResolvedValue(true),
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
    const onEdit = vi.fn()
    const { result } = renderHook(() => useRequisitionTable({ onEditRequest: onEdit }))
    expect(result.current.rows).toHaveLength(1)
    act(() => result.current.setQuery('no match'))
    expect(result.current.rows).toHaveLength(0)
  })

  it('maps row on edit', () => {
    const onEdit = vi.fn()
    const { result } = renderHook(() => useRequisitionTable({ onEditRequest: onEdit }))
    act(() => result.current.onEdit({ id: '1', snCode: 'REQ-1', debtorName: 'John Doe', projectCode: 'PRJ-1', date_created: '2025-01-01' }))
    expect(onEdit).toHaveBeenCalledWith({
      id: '1',
      employeeId: 'emp1',
      projectId: 'pr1',
      requisitionKey: 'REQ-1',
    })
  })
})
