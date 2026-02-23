import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useAuthorizationList from './useAuthorizationList'

const getAuthorizationsByIdAuthorizer = vi.fn()
const resetFlags = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/main-page/authorizations/authorizationslist',
}))

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: {
      showAlert: vi.fn(),
      hideAlert: vi.fn(),
    },
    usePrincipalLoading: {
      showSpinner: vi.fn(),
      hideSpinner: vi.fn(),
    },
  }),
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: { idEmployee: 'emp-1' },
  }),
}))

vi.mock('@/app/stores/useAuthorizationsStore/useAuthorizationsStore', () => ({
  useAuthorizationsStore: () => ({
    authorizations: [
      {
        authorization_id: 'auth-1',
        event_id: 'evt-1',
        enterprise: { name: 'DR' },
        department: { name: 'Compras' },
        applicant: { fullname: 'Ana Perez' },
        kind: { name: 'Requisición' },
        proyect: { proyectKey: 'PR-01' },
        dateCreated: '2026-02-10',
        status: 'Pendiente',
      },
      {
        authorization_id: 'auth-2',
        event_id: 'evt-2',
        enterprise: { name: 'VIP' },
        department: { name: 'Tesorería' },
        applicant: { fullname: 'Luis Garcia' },
        kind: { name: 'Vale' },
        proyect: { proyectKey: 'PR-02' },
        dateCreated: '2026-02-11',
        status: 'Rechazada',
      },
    ],
    loading: false,
    error: null,
    getAuthorizationsByIdAuthorizer,
    resetFlags,
  }),
}))

describe('useAuthorizationList', () => {
  beforeEach(() => {
    getAuthorizationsByIdAuthorizer.mockClear()
    resetFlags.mockClear()
  })

  it('prepara filas y filtros', () => {
    const { result } = renderHook(() => useAuthorizationList())
    expect(result.current.rows).toHaveLength(2)
    expect(result.current.filterOptions.length).toBeGreaterThan(0)
  })

  it('filtra por estatus', () => {
    const { result } = renderHook(() => useAuthorizationList())
    act(() => {
      result.current.handleFilterChange('rechazada')
    })
    expect(result.current.filterValue).toBe('rechazada')
    expect(result.current.rows).toHaveLength(1)
  })
})
