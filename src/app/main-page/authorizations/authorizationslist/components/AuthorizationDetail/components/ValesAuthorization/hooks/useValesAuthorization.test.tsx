import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import useValesAuthorization from './useValesAuthorization'

const fetchPettyCashVoucherById = vi.fn()
const fetchPettyCashVouchers = vi.fn()
const getAuthorizations = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/main-page/authorizations/authorizationslist',
  useSearchParams: () =>
    new URLSearchParams('authorization_id=auth-1&event_id=voucher-1&kind=Vale Azul'),
}))

vi.mock('@/app/stores/system/useIntranetGatewayStore', () => ({
  useIntranetGatewayStore: (selector: any) => selector({ isReady: true }),
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

vi.mock('@/app/stores/useAuthorizationsStore/useAuthorizationsStore', () => ({
  useAuthorizationsStore: () => ({
    authorizations: [
      {
        authorization_id: 'auth-1',
        status: 'Pendiente',
        authorizer: { employee_id: 'emp-1' },
      },
    ],
    getAuthorizations,
    approveAuthorization: vi.fn(),
    rejectAuthorization: vi.fn(),
    updateAuthorizationAuthorizer: vi.fn(),
  }),
}))

vi.mock('@/app/stores/useBillingPettyCash/useBillingPettyCash', () => ({
  useBillingPettyCash: () => ({
    pettyCashVouchers: [
      {
        id: 'voucher-1',
        employeename: 'Luis Garcia',
        application_date: '2026-02-10',
        concept: 'Materiales',
        voucher_type: 'Vale Azul',
        amount: 1000,
        status: 'Pendiente',
      },
    ],
    pettyCashVoucherFull: {
      id: 'voucher-1',
      employeename: 'Luis Garcia',
      application_date: '2026-02-10',
      concept: 'Materiales',
      voucher_type: 'Vale Azul',
      amount: 1000,
      status: 'Pendiente',
      subtotal: 900,
      iva: 100,
      total: 1000,
    },
    loading: false,
    error: null,
    fetchPettyCashVoucherById,
    fetchPettyCashVouchers,
    resetFlags: vi.fn(),
  }),
}))

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: () => ({
    employees: [{ employee_id: 'emp-1', fullname: 'Luis Garcia' }],
    employeesError: null,
    fetchEmployees: vi.fn(),
  }),
}))

describe('useValesAuthorization', () => {
  it('carga detalle e historial de vales', async () => {
    const { result } = renderHook(() => useValesAuthorization())

    await waitFor(() => {
      expect(fetchPettyCashVoucherById).toHaveBeenCalledWith('voucher-1', true)
      expect(fetchPettyCashVouchers).toHaveBeenCalledWith(true)
    })

    expect(result.current.rows).toHaveLength(1)
    expect(result.current.isPendingStatus).toBe(true)
  })
})
