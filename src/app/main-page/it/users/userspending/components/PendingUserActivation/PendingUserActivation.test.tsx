import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PendingUserActivation from './PendingUserActivation'

const dynamicFormState = vi.hoisted(() => ({
  valid: true,
}))

vi.mock('@/app/components/Breadcrumbs/Breadcrumbs', () => {
  const Item = ({ renderContent }: any) => (
    <div data-testid="breadcrumb-item">{renderContent}</div>
  )

  const Breadcrumbs = ({ children }: any) => (
    <div data-testid="breadcrumbs">{children}</div>
  )

  Breadcrumbs.Item = Item

  return {
    __esModule: true,
    default: Breadcrumbs,
  }
})

vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ children, disabled, onClick, type = 'button' }: any) => (
    <button type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}))

vi.mock('@/app/components/DynamicForm/DynamicForm', () => ({
  __esModule: true,
  default: ({ fields, onValidChange, onValuesChange }: any) => {
    const initializedRef = React.useRef(false)

    React.useEffect(() => {
      if (initializedRef.current) return
      initializedRef.current = true

      onValidChange?.(dynamicFormState.valid)
      onValuesChange?.(
        fields.reduce((acc: Record<string, unknown>, field: any) => {
          acc[field.name] = field.value
          return acc
        }, {}),
      )
    }, [fields, onValidChange, onValuesChange])

    return (
      <div data-testid="dynamic-form">
        {fields.map((field: any) => (
          <div
            key={field.name}
            data-testid={`field-${field.name}`}
            data-validations={JSON.stringify(field.validations ?? [])}
          />
        ))}
      </div>
    )
  },
}))

vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: ({
    children,
    primaryLabel,
    primaryDisabled,
    onPrimaryClick,
    showSecondaryButton,
    secondaryLabel,
  }: any) => (
    <div>
      {children}
      <button
        type="button"
        disabled={primaryDisabled}
        onClick={onPrimaryClick}
      >
        {primaryLabel}
      </button>
      {showSecondaryButton ? <button type="button">{secondaryLabel}</button> : null}
    </div>
  ),
}))

vi.mock('@/app/components/SignaturePAD/SignaturePAD', () => ({
  __esModule: true,
  default: ({ onSignatureSave }: any) => (
    <button
      type="button"
      onClick={() => onSignatureSave('data:image/png;base64,new-signature')}
    >
      Guardar firma
    </button>
  ),
}))

describe('PendingUserActivation', () => {
  const onActivate = vi.fn()

  const user = {
    id: 'emp-1',
    fullname: 'Katherine Negrete',
    avatarUrl: undefined,
    department: 'TI',
    position: 'Desarrolladora',
    employeeNumber: '40017',
    hasFingerprint: true,
    company: 'DR',
    firstName: 'Katherine',
    middleName: '',
    lastName: 'Negrete',
    secondLastName: 'Aguilar',
    managerName: 'Manager',
    departmentLabel: 'TI',
    companyLabel: 'DR',
    positionLabel: 'Desarrolladora',
    email: 'katherine@example.com',
    businessPhone: '5639728912',
    userRoleId: 'role-1',
    roleName: 'Administrador',
    changePasswordOnNextLogin: true,
    managerialPermissions: false,
    deviceType: '',
    deviceBrand: '',
    deviceModel: '',
    deviceStatus: '',
    provisionalPassword: 'Temp1234!',
    nip: '',
    signature: undefined,
  }

  beforeEach(() => {
    onActivate.mockReset()
    dynamicFormState.valid = true
  })

  it('no marca la imagen como requerida y permite activar sin firma', () => {
    render(
      <PendingUserActivation
        user={user}
        roleOptions={[{ label: 'Administrador', value: 'role-1' }]}
        onActivate={onActivate}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByTestId('field-profileImage')).toHaveAttribute(
      'data-validations',
      '[]',
    )

    const activateButton = screen.getByRole('button', {
      name: 'Activar cuenta',
    })

    expect(activateButton).toBeEnabled()
    fireEvent.click(activateButton)

    expect(onActivate).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'emp-1',
        signature: '',
      }),
    )
  })

  it('muestra el mensaje actualizado de firma opcional', () => {
    render(
      <PendingUserActivation
        user={user}
        roleOptions={[{ label: 'Administrador', value: 'role-1' }]}
        onActivate={onActivate}
        onClose={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    expect(
      screen.getByText('La firma es opcional para activar la cuenta.'),
    ).toBeInTheDocument()
  })
})
