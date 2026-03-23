import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useChangeDriver from './useChangeDriver'

const { showAlert, changeDriver, fetchEmployees } = vi.hoisted(() => ({
  showAlert: vi.fn(),
  changeDriver: vi.fn(async () => true),
  fetchEmployees: vi.fn(async () => undefined),
}))

const { usePrincipalMock, useEmployeesStoreMock, useTransportStoreMock, transportStoreState, employeesStoreState } =
  vi.hoisted(() => {
    const transportState = {
      currentAssignment: {
        vehicleassignments_id: 'A1',
        employee_id: 'E1',
      },
      changeDriver,
      changingDriver: false,
    }

    const employeesState = {
      employees: [{ employee_id: 'E2', fullname: 'Nuevo Conductor' }],
      fetchEmployees,
    }

    const principal = () => ({
      usePrincipalAlert: { showAlert },
    })

    const transportHook = vi.fn((selector?: any) =>
      typeof selector === 'function' ? selector(transportState) : transportState
    )
    const employeesHook = vi.fn((selector?: any) =>
      typeof selector === 'function' ? selector(employeesState) : employeesState
    )

    return {
      usePrincipalMock: principal,
      useEmployeesStoreMock: employeesHook,
      useTransportStoreMock: transportHook,
      transportStoreState: transportState,
      employeesStoreState: employeesState,
    }
  })

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => usePrincipalMock(),
}))

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: useEmployeesStoreMock,
}))

vi.mock('@/app/stores/useTransportStore/useTransportStore', () => ({
  useTransportStore: useTransportStoreMock,
}))

describe('useChangeDriver', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    transportStoreState.currentAssignment.vehicleassignments_id = 'A1'
    transportStoreState.currentAssignment.employee_id = 'E1'
    employeesStoreState.employees = [{ employee_id: 'E2', fullname: 'Nuevo Conductor' }] as any
  })

  it('submits changeDriver with assignment and selected employee', async () => {
    const { result } = renderHook(() => useChangeDriver())

    act(() => {
      result.current.setSelected(['E2'])
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(changeDriver).toHaveBeenCalledWith({
      id_vehicleAssignments: 'A1',
      id_newEmployee: 'E2',
    })
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success' })
    )
  })

  it('warns when selected employee is missing', async () => {
    const { result } = renderHook(() => useChangeDriver())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(changeDriver).not.toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'warning' })
    )
  })
})

