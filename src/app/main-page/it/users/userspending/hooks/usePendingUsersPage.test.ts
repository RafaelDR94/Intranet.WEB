import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import usePendingUsersPage from './usePendingUsersPage'

const {
  showAlert,
  showSpinner,
  hideSpinner,
  updateQuery,
  uploadImage,
  getUsersStoreState,
  setUsersStoreState,
  getEmployeesStoreState,
  setEmployeesStoreState,
  getQueryState,
  setQueryState,
  assignMock,
} = vi.hoisted(() => {
  let usersStoreState: any
  let employeesStoreState: any
  let queryState: any

  return {
    showAlert: vi.fn(),
    showSpinner: vi.fn(),
    hideSpinner: vi.fn(),
    updateQuery: vi.fn(),
    uploadImage: vi.fn(),
    getUsersStoreState: () => usersStoreState,
    setUsersStoreState: (value: any) => {
      usersStoreState = value
    },
    getEmployeesStoreState: () => employeesStoreState,
    setEmployeesStoreState: (value: any) => {
      employeesStoreState = value
    },
    getQueryState: () => queryState,
    setQueryState: (value: any) => {
      queryState = value
    },
    assignMock: vi.fn(),
  }
})

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}))

vi.mock('@/app/context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: () => ({
    firebasestorage: {
      uploadImage,
    },
  }),
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    currentPagePermissions: { activateUser: true, reactivateUser: true },
  }),
}))

vi.mock('@/app/hooks/useQuery/useQuery', () => ({
  __esModule: true,
  default: () => getQueryState(),
}))

vi.mock('@/app/stores/useUsersStore/useUsersStore', () => ({
  useUsersStore: Object.assign(
    (selector: any) => selector(getUsersStoreState()),
    {
      getState: () => getUsersStoreState(),
    },
  ),
}))

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: (selector: any) => selector(getEmployeesStoreState()),
}))

describe('usePendingUsersPage', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      location: {
        assign: assignMock,
      },
    })

    setQueryState({
      all: { id: 'emp-1' },
      updateQuery,
    })

    setUsersStoreState({
      employeesWithoutActiveUser: [
        {
          employee_id: 'emp-1',
          image_url: 'https://cdn.example.com/avatar.jpg',
          fullname: 'Katherine Negrete',
          department: 'TI',
          workposition: 'Desarrolladora',
          employee_number: '40017',
          dr_fingerprint: true,
        },
      ],
      roles: [{ id: 'role-1', name: 'Administrador' }],
      users: [],
      createUser: vi.fn().mockImplementation(async (payload) => {
        getUsersStoreState().users = [
          {
            user_id: 'user-1',
            username: payload.username,
            employee_id: payload.employeeId,
            idemployee: payload.employeeId,
          },
        ]

        return {
          user_id: 'user-1',
          username: payload.username,
          employee_id: payload.employeeId,
        }
      }),
      toggleActive: vi.fn().mockResolvedValue(true),
      fetchEmployeesWithoutActiveUser: vi.fn().mockResolvedValue([]),
      fetchEmployeesWithActiveUser: vi.fn().mockResolvedValue([]),
      fetchRoles: vi.fn().mockResolvedValue([]),
      creating: false,
      togglingActive: false,
      updating: false,
      loadingWithoutActiveUser: false,
      loadingWithActiveUser: false,
      loadingRoles: false,
      error: undefined,
      resetFlags: vi.fn(),
    })

    setEmployeesStoreState({
      employee: {
        employee_id: 'emp-1',
        employee_number: '40017',
        fullname: 'Katherine Negrete Aguilar',
        firstname: 'Katherine',
        secondname: '',
        lastname: 'Negrete',
        motherlast_name: 'Aguilar',
        email: 'negreteaakathy@gmail.com',
        phone_number: '5639728912',
        extension: '',
        image_url: 'https://cdn.example.com/avatar.jpg',
        manager_id: 'manager-1',
        department: {
          name: 'DESARROLLO TECNOLOGICO',
          enterprice_name: 'DR MEXICO',
        },
        workposition: {
          name: 'DESARROLLADOR WEB',
        },
        workposition_name: 'DESARROLLADOR WEB',
      },
      fetchEmployeeById: vi.fn().mockResolvedValue(undefined),
      loadingById: false,
      error: undefined,
      resetEmployee: vi.fn(),
      resetFlags: vi.fn(),
    })

    showAlert.mockClear()
    showSpinner.mockClear()
    hideSpinner.mockClear()
    updateQuery.mockClear()
    uploadImage.mockReset()
    assignMock.mockReset()
  })

  it('activa la cuenta, refresca listas y abre el popup de asignacion', async () => {
    const { result } = renderHook(() => usePendingUsersPage())

    await act(async () => {
      await result.current.handleActivateUser({
        userId: 'emp-1',
        profileImage: null,
        email: 'negreteaakathy@gmail.com',
        businessPhone: '5639728912',
        userRoleId: 'role-1',
        managerialPermissions: true,
        provisionalPassword: 'Temp1234!',
        changePasswordOnNextLogin: true,
        hasFingerprint: true,
        signature: '',
      })
    })

    expect(getUsersStoreState().createUser).toHaveBeenCalledWith({
      username: 'negreteaakathy@gmail.com',
      imageUrl: 'https://cdn.example.com/avatar.jpg',
      phoneNumber: '5639728912',
      isGerence: true,
      drFingerprint: true,
      password: 'Temp1234!',
      signature: '',
      roleId: 'role-1',
      employeeId: 'emp-1',
      changePassword: true,
    })

    expect(
      getUsersStoreState().fetchEmployeesWithoutActiveUser,
    ).toHaveBeenCalledWith(
      true,
    )
    expect(
      getUsersStoreState().fetchEmployeesWithActiveUser,
    ).toHaveBeenCalledWith(true)
    expect(result.current.assignmentPromptOpen).toBe(true)
    expect(result.current.assignmentPromptEmployeeId).toBe('emp-1')
    expect(updateQuery).not.toHaveBeenCalled()
  })

  it('abre popup de reactivacion cuando el empleado ya tiene usuario', async () => {
    setQueryState({
      all: {},
      updateQuery,
    })

    getEmployeesStoreState().fetchEmployeeById.mockResolvedValueOnce({
      ...getEmployeesStoreState().employee,
      user: {
        user_id: 'user-9',
        is_active: false,
      },
    })

    const { result } = renderHook(() => usePendingUsersPage())

    await act(async () => {
      await result.current.handleOpenActivation({
        id: 'emp-1',
        fullname: 'Katherine Negrete',
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
        department: 'TI',
        position: 'Desarrolladora',
        employeeNumber: '40017',
        hasFingerprint: true,
      })
    })

    expect(result.current.reactivationPromptOpen).toBe(true)
    expect(updateQuery).not.toHaveBeenCalled()
  })

  it('reactiva el usuario y refresca ambas listas', async () => {
    setQueryState({
      all: {},
      updateQuery,
    })

    getEmployeesStoreState().fetchEmployeeById.mockResolvedValueOnce({
      ...getEmployeesStoreState().employee,
      user: {
        user_id: 'user-9',
        is_active: false,
      },
    })

    const { result } = renderHook(() => usePendingUsersPage())

    await act(async () => {
      await result.current.handleOpenActivation({
        id: 'emp-1',
        fullname: 'Katherine Negrete',
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
        department: 'TI',
        position: 'Desarrolladora',
        employeeNumber: '40017',
        hasFingerprint: true,
      })
    })

    await act(async () => {
      await result.current.handleConfirmReactivation()
    })

    expect(getUsersStoreState().toggleActive).toHaveBeenCalledWith({
      id: 'user-9',
      isActive: true,
    })
    expect(
      getUsersStoreState().fetchEmployeesWithoutActiveUser,
    ).toHaveBeenCalledWith(true)
    expect(
      getUsersStoreState().fetchEmployeesWithActiveUser,
    ).toHaveBeenCalledWith(true)
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Usuario reactivado',
      }),
    )
  })

  it('cierra la activacion y muestra exito cuando se omite la asignacion', async () => {
    const { result } = renderHook(() => usePendingUsersPage())

    await act(async () => {
      await result.current.handleActivateUser({
        userId: 'emp-1',
        profileImage: null,
        email: 'negreteaakathy@gmail.com',
        businessPhone: '5639728912',
        userRoleId: 'role-1',
        managerialPermissions: true,
        provisionalPassword: 'Temp1234!',
        changePasswordOnNextLogin: true,
        hasFingerprint: true,
        signature: 'data:image/png;base64,signature',
      })
    })

    act(() => {
      result.current.handleSkipDeviceAssignment()
    })

    expect(updateQuery).toHaveBeenCalledWith({ id: null, label: null })
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Cuenta activada',
      }),
    )
    expect(result.current.assignmentPromptOpen).toBe(false)
  })

  it('navega a asignacion con employeeId cuando se acepta el popup', async () => {
    const { result } = renderHook(() => usePendingUsersPage())

    await act(async () => {
      await result.current.handleActivateUser({
        userId: 'emp-1',
        profileImage: null,
        email: 'negreteaakathy@gmail.com',
        businessPhone: '5639728912',
        userRoleId: 'role-1',
        managerialPermissions: true,
        provisionalPassword: 'Temp1234!',
        changePasswordOnNextLogin: true,
        hasFingerprint: true,
        signature: 'data:image/png;base64,signature',
      })
    })

    act(() => {
      result.current.handleGoToDeviceAssignment()
    })

    expect(updateQuery).toHaveBeenCalledWith({ id: null, label: null })
    expect(assignMock).toHaveBeenCalledWith(
      '/main-page/it/internaldevices/internaldevicesasignation?view=new&employeeId=emp-1',
    )
  })

  it('envia imageUrl vacio cuando no existe avatar previo ni imagen nueva', async () => {
    setUsersStoreState({
      ...getUsersStoreState(),
      employeesWithoutActiveUser: [
        {
          ...getUsersStoreState().employeesWithoutActiveUser[0],
          image_url: '',
        },
      ],
      createUser: vi.fn().mockImplementation(async (payload) => {
        getUsersStoreState().users = [
          {
            user_id: 'user-1',
            username: payload.username,
            employee_id: payload.employeeId,
            idemployee: payload.employeeId,
          },
        ]

        return {
          user_id: 'user-1',
          username: payload.username,
          employee_id: payload.employeeId,
        }
      }),
    })

    setEmployeesStoreState({
      ...getEmployeesStoreState(),
      employee: {
        ...getEmployeesStoreState().employee,
        image_url: '',
      },
    })

    const { result } = renderHook(() => usePendingUsersPage())

    await act(async () => {
      await result.current.handleActivateUser({
        userId: 'emp-1',
        profileImage: null,
        email: 'negreteaakathy@gmail.com',
        businessPhone: '5639728912',
        userRoleId: 'role-1',
        managerialPermissions: true,
        provisionalPassword: 'Temp1234!',
        changePasswordOnNextLogin: true,
        hasFingerprint: true,
        signature: '',
      })
    })

    expect(getUsersStoreState().createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        imageUrl: '',
        signature: '',
      }),
    )
  })
})
