import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import UserAccountDetail from './UserAccountDetail'

const toggleActiveMock = vi.fn()
const fetchEmployeesWithActiveUserMock = vi.fn()
const resetFlagsMock = vi.fn()
const showAlertMock = vi.fn()

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    currentPagePermissions: {
      deactivateUser: true,
    },
  }),
}))

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: {
      showAlert: showAlertMock,
    },
  }),
}))

vi.mock('@/app/stores/useUsersStore/useUsersStore', () => {
  const store = vi.fn((selector: any) =>
    selector({
      toggleActive: toggleActiveMock,
      fetchEmployeesWithActiveUser: fetchEmployeesWithActiveUserMock,
      togglingActive: false,
      resetFlags: resetFlagsMock,
      error: undefined,
    }),
  )

  store.getState = () => ({
    error: undefined,
  })

  return {
    useUsersStore: store,
  }
})

vi.mock('@/app/components/DetailsPanelLayout/DetailsPanelLayout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('./components/DetailsTab', () => ({
  __esModule: true,
  default: () => <div data-testid="details-tab" />,
}))

vi.mock('./components/UpdateUserTab', () => ({
  __esModule: true,
  default: () => <div data-testid="update-user-tab" />,
}))

vi.mock('@/app/components/ButtonsNavigation/ButtonsNavigation', () => {
  const Item = () => null

  const ButtonsNavigation = ({
    children,
    activeId,
    onActiveChange,
  }: any) => {
    const items = React.Children.toArray(children).filter(Boolean) as React.ReactElement[]
    const activeItem =
      items.find((child) => child.props.id === activeId) ?? items[0]

    return (
      <div>
        {items.map((child) => (
          <button
            key={child.props.id}
            type="button"
            disabled={child.props.disabled}
            onClick={() => {
              child.props.onClick?.()
              onActiveChange?.(child.props.id)
            }}
          >
            {child.props.label}
          </button>
        ))}
        <div>{activeItem?.props.renderContent}</div>
      </div>
    )
  }

  ButtonsNavigation.Item = Item

  return {
    __esModule: true,
    default: ButtonsNavigation,
  }
})

vi.mock('@/app/components/PopUp/PopUp', () => ({
  PopUp: (props: any) =>
    props.open ? (
      <div data-testid="deactivate-popup">
        <button type="button" onClick={props.onPrimaryButtonClick}>
          {props.primaryButtonText}
        </button>
        <button type="button" onClick={props.onClose}>
          cerrar
        </button>
      </div>
    ) : null,
}))

describe('UserAccountDetail', () => {
  beforeEach(() => {
    toggleActiveMock.mockReset()
    fetchEmployeesWithActiveUserMock.mockReset()
    resetFlagsMock.mockReset()
    showAlertMock.mockReset()
  })

  it('abre el popup y desactiva el usuario al confirmar', async () => {
    toggleActiveMock.mockResolvedValue(true)
    fetchEmployeesWithActiveUserMock.mockResolvedValue([])

    const onClose = vi.fn()

    render(
      <UserAccountDetail
        open
        onClose={onClose}
        user={{
          id: 'employee-1',
          userId: 'user-1',
          fullname: 'Frankie Rivers Negrete Aguilar',
          avatarUrl: undefined,
          department: 'Reportes',
          position: 'Gerente Operativo',
          employeeNumber: '133123',
          isActive: true,
          hasFingerprint: false,
          company: 'DR Mexico',
          statusLabel: 'Activo',
          username: 'frankie',
          userRoleId: 'role-1',
          twoFactorEnabled: false,
          changePasswordOnNextLogin: false,
          managerialPermissions: false,
          businessPhone: '5639728912',
          provisionalPassword: '',
          phone: '5639728912',
          email: 'frankie.rivers@dr.com',
          roleName: 'Admin',
          departmentLabel: 'Reportes',
          positionLabel: 'Gerente Operativo',
          assignedDevices: [],
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Desactivar Usuario' }))

    expect(screen.getByTestId('deactivate-popup')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }))

    await waitFor(() => {
      expect(toggleActiveMock).toHaveBeenCalledWith({
        id: 'user-1',
        isActive: false,
      })
    })

    expect(fetchEmployeesWithActiveUserMock).toHaveBeenCalledWith(true)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
