import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import PendingUsersPage from './page'
import usePendingUsersPage from './hooks/usePendingUsersPage'

vi.mock('./hooks/usePendingUsersPage', () => ({
  __esModule: true,
  default: vi.fn(),
}))

vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
}))

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: () => <div data-testid="pending-users-table" />,
}))

vi.mock('./components/PendingUserActivation/PendingUserActivation', () => ({
  __esModule: true,
  default: () => <div data-testid="pending-user-activation" />,
}))

vi.mock('@/app/components/PopUp/PopUp', () => ({
  PopUp: (props: any) =>
    props.open ? (
      <div
        data-testid={
          props.title === 'Asignación de dispositivo'
            ? 'assignment-popup'
            : 'reactivation-popup'
        }
      >
        <button type="button" onClick={props.onPrimaryButtonClick}>
          {props.primaryButtonText}
        </button>
        <button type="button" onClick={props.onSecondaryButtonClick}>
          {props.secondaryButtonText}
        </button>
      </div>
    ) : null,
}))

describe('PendingUsersPage', () => {
  const mockHook = usePendingUsersPage as unknown as Mock

  beforeEach(() => {
    mockHook.mockReset()
  })

  it('muestra el popup de asignacion cuando el hook lo solicita', () => {
    mockHook.mockReturnValue({
      assignmentPromptOpen: true,
      filteredRows: [],
      isActivationOpen: false,
      reactivationPromptOpen: false,
      roleOptions: [],
      selectedFilter: 'all',
      selectedUser: null,
      handleActivateUser: vi.fn(),
      handleCloseActivation: vi.fn(),
      handleCloseAssignmentPrompt: vi.fn(),
      handleCloseReactivationPrompt: vi.fn(),
      handleConfirmReactivation: vi.fn(),
      handleFilterChange: vi.fn(),
      handleGoToDeviceAssignment: vi.fn(),
      handleOpenActivation: vi.fn(),
      handleSkipDeviceAssignment: vi.fn(),
    })

    render(<PendingUsersPage />)

    expect(screen.getByTestId('assignment-popup')).toBeInTheDocument()
  })

  it('muestra el popup de reactivacion cuando el hook lo solicita', () => {
    mockHook.mockReturnValue({
      assignmentPromptOpen: false,
      filteredRows: [],
      isActivationOpen: false,
      reactivationPromptOpen: true,
      roleOptions: [],
      selectedFilter: 'all',
      selectedUser: null,
      handleActivateUser: vi.fn(),
      handleCloseActivation: vi.fn(),
      handleCloseAssignmentPrompt: vi.fn(),
      handleCloseReactivationPrompt: vi.fn(),
      handleConfirmReactivation: vi.fn(),
      handleFilterChange: vi.fn(),
      handleGoToDeviceAssignment: vi.fn(),
      handleOpenActivation: vi.fn(),
      handleSkipDeviceAssignment: vi.fn(),
    })

    render(<PendingUsersPage />)

    expect(screen.getByTestId('reactivation-popup')).toBeInTheDocument()
  })
})
