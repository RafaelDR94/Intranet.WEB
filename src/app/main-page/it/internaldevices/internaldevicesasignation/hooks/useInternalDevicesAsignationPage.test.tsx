import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useInternalDevicesAsignationPage from './useInternalDevicesAsignationPage'

const {
  showAlert,
  showSpinner,
  hideSpinner,
  updateQuery,
  getQueryState,
  setQueryState,
  getEmployeesStoreState,
  setEmployeesStoreState,
  getInternalDevicesStoreState,
  setInternalDevicesStoreState,
} = vi.hoisted(() => {
  let queryState: any
  let employeesStoreState: any
  let internalDevicesStoreState: any

  return {
    showAlert: vi.fn(),
    showSpinner: vi.fn(),
    hideSpinner: vi.fn(),
    updateQuery: vi.fn(),
    getQueryState: () => queryState,
    setQueryState: (value: any) => {
      queryState = value
    },
    getEmployeesStoreState: () => employeesStoreState,
    setEmployeesStoreState: (value: any) => {
      employeesStoreState = value
    },
    getInternalDevicesStoreState: () => internalDevicesStoreState,
    setInternalDevicesStoreState: (value: any) => {
      internalDevicesStoreState = value
    },
  }
})

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: { idEmployee: 'session-employee', fullName: 'Usuario actual' },
  }),
}))

vi.mock('@/app/context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: () => ({
    firebasestorage: {
      uploadFile: vi.fn(),
    },
  }),
}))

vi.mock('@/app/hooks/useQuery/useQuery', () => ({
  __esModule: true,
  default: () => getQueryState(),
}))

vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
}))

vi.mock('@/tutorials/engine/useTutorialAutoRun', () => ({
  __esModule: true,
  default: vi.fn(),
}))

vi.mock('./useInternalDevicesAsignation', () => ({
  __esModule: true,
  default: () => ({
    deviceAssignments: [],
    handleRefresh: vi.fn(),
  }),
}))

vi.mock('./useInternalDevicesAsignationTable', () => ({
  __esModule: true,
  default: () => ({
    columns: [],
    rows: [],
    searchableKeys: [],
    statusFilter: 'all',
    statusFilterOptions: [],
    handleStatusFilterChange: vi.fn(),
  }),
}))

vi.mock('@/app/utilities/PDF/PDF', () => ({
  CreatePDFBlob: vi.fn(),
}))

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: (selector: any) => selector(getEmployeesStoreState()),
}))

vi.mock('@/app/stores/useInternalDevicesStore/useInternalDevicesStore', () => ({
  useInternalDevicesStore: (selector: any) =>
    selector(getInternalDevicesStoreState()),
}))

vi.mock(
  '@/app/stores/useDeviceAssignmentResponsiveUrlStore/useDeviceAssignmentResponsiveUrlStore',
  () => ({
    useDeviceAssignmentResponsiveUrlStore: (selector: any) =>
      selector({
        updateDeviceAssignmentResponsiveUrl: vi.fn(),
      }),
  }),
)

describe('useInternalDevicesAsignationPage', () => {
  beforeEach(() => {
    setQueryState({
      all: {
        view: 'new',
        employeeId: 'emp-1',
      },
      updateQuery,
    })

    setEmployeesStoreState({
      activeEmployees: [
        {
          id: 'emp-1',
          employee_id: 'emp-1',
          fullname: 'Katherine Negrete',
        },
      ],
      fetchActiveEmployees: vi.fn().mockResolvedValue([]),
      fetchEmployeeById: vi.fn().mockResolvedValue(null),
      loadingActive: false,
    })

    setInternalDevicesStoreState({
      devices: [],
      deviceStatuses: [],
      fetchDevices: vi.fn().mockResolvedValue([]),
      fetchDeviceStatuses: vi.fn().mockResolvedValue([]),
      fetchDeviceById: vi.fn().mockResolvedValue(null),
      fetchDeviceAssignmentById: vi.fn().mockResolvedValue(null),
      fetchDeviceAssignments: vi.fn().mockResolvedValue([]),
      createDeviceAssignment: vi.fn().mockResolvedValue(null),
      creatingDeviceAssignment: false,
      successCreateDeviceAssignment: false,
      loadingDevices: false,
      loadingDeviceStatuses: false,
      loadingDeviceAssignment: false,
      deviceAssignment: null,
      device: null,
      error: undefined,
      resetFlags: vi.fn(),
    })

    showAlert.mockClear()
    showSpinner.mockClear()
    hideSpinner.mockClear()
    updateQuery.mockClear()
  })

  it('precarga employee_id cuando employeeId existe en la query y en los empleados activos', () => {
    const { result } = renderHook(() => useInternalDevicesAsignationPage())

    expect(result.current.formValues.employee_id).toBe('emp-1')
  })

  it('limpia employee_id y avisa cuando employeeId no existe en empleados activos', () => {
    setQueryState({
      all: {
        view: 'new',
        employeeId: 'emp-x',
      },
      updateQuery,
    })

    const { result } = renderHook(() => useInternalDevicesAsignationPage())

    expect(result.current.formValues.employee_id).toBe('')
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'warning',
        title: 'Colaborador no disponible',
      }),
    )
  })

  it('mantiene el flujo actual cuando no se recibe employeeId', () => {
    setQueryState({
      all: {
        view: 'new',
      },
      updateQuery,
    })

    const { result } = renderHook(() => useInternalDevicesAsignationPage())

    expect(result.current.formValues.employee_id).toBe('')
    expect(showAlert).not.toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Colaborador no disponible',
      }),
    )
  })
})
