import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import useRequisitionsDetails from './useRequisitionsDetails'

const fetchCurrentRequisition = vi.fn()

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('id=1'),
}))

vi.mock('@/app/stores/useRequisitionStore/useRequisitionStore', () => ({
  useRequisitionsStore: (sel: any) =>
    sel({
      successPut: false,
      currentRequisition: { id: '1' },
      gettincurrentReq: false,
      error: undefined,
      fetchCurrentRequisition,
      resetCurrentReq: vi.fn(),
      resetFlags: vi.fn(),
    }),
}))

vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: (sel: any) => sel({ succesReject: false }),
}))

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
  }),
}))

describe('useRequisitionsDetails', () => {
  it('fetches requisition on mount when id exists', () => {
    renderHook(() => useRequisitionsDetails())
    expect(fetchCurrentRequisition).toHaveBeenCalledWith('1')
  })
})
