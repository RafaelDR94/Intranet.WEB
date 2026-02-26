import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import AuthorizationDetail from './AuthorizationDetail'
import useAuthorizationDetail from './hooks/useAuthorizationDetail'

vi.mock('./hooks/useAuthorizationDetail', () => ({
  __esModule: true,
  default: vi.fn(),
}))

vi.mock('./components/RequisitionsAuthorization/RequisitionsAuthorization', () => ({
  __esModule: true,
  default: () => <div>RequisitionsAuthorizationMock</div>,
}))

vi.mock('./components/ValesAuthorization/ValesAuthorization', () => ({
  __esModule: true,
  default: () => <div>ValesAuthorizationMock</div>,
}))

describe('AuthorizationDetail', () => {
  const mockHook = useAuthorizationDetail as unknown as Mock

  beforeEach(() => {
    mockHook.mockReset()
  })

  it('renderiza requisiciones cuando el hook indica requisicion', () => {
    mockHook.mockReturnValue({
      isRequisition: true,
      isVale: false,
      kind: 'Requisicion',
      normalizedKind: 'requisicion',
    })
    render(<AuthorizationDetail />)
    expect(screen.getByText('RequisitionsAuthorizationMock')).toBeInTheDocument()
  })

  it('renderiza vales cuando el hook indica vale', () => {
    mockHook.mockReturnValue({
      isRequisition: false,
      isVale: true,
      kind: 'Vale',
      normalizedKind: 'vale',
    })
    render(<AuthorizationDetail />)
    expect(screen.getByText('ValesAuthorizationMock')).toBeInTheDocument()
  })
})
