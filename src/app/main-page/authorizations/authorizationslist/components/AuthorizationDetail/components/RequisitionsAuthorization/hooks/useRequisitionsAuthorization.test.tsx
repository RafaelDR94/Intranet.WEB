import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import useRequisitionsAuthorization from './useRequisitionsAuthorization'

const fetchCurrentRequisition = vi.fn()
const fetchBillingDocumentByIdRequisition = vi.fn()
const getAuthorizations = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/main-page/authorizations/authorizationslist',
  useSearchParams: () => new URLSearchParams('authorization_id=auth-1&event_id=req-1'),
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

vi.mock('@/app/stores/useRequisitionStore/useRequisitionStore', () => ({
  useRequisitionsStore: () => ({
    currentRequisition: {
      amountdeposited: '1000',
      provenamount: '900',
      amountdifference: '100',
      assignmentdate: '2026-02-01',
      endDate: '2026-02-05',
      date_created: '2026-02-05',
    },
    gettincurrentReq: false,
    error: null,
    fetchCurrentRequisition,
    resetCurrentReq: vi.fn(),
    resetFlags: vi.fn(),
    downloadRequistionResume: vi.fn(),
    downloadingDocument: false,
    succesDownloadDocument: false,
  }),
}))

vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: () => ({
    billingDocuments: [{ billingdocument_id: 'doc-1' }],
    loading: false,
    error: null,
    fetchBillingDocumentByIdRequisition,
    resetFlags: vi.fn(),
  }),
}))

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: () => ({
    employees: [{ employee_id: 'emp-1', fullname: 'Luis Garcia' }],
    error: null,
    fetchEmployees: vi.fn(),
  }),
}))

vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper', () => ({
  BillingDocumentDetailsTableListMap: () => [
    { billingdocument_id: 'doc-1', fecha: '2026-02-02' },
  ],
}))

describe('useRequisitionsAuthorization', () => {
  it('carga requisicion y documentos al iniciar', async () => {
    const { result } = renderHook(() => useRequisitionsAuthorization())

    await waitFor(() => {
      expect(fetchCurrentRequisition).toHaveBeenCalledWith('req-1')
      expect(fetchBillingDocumentByIdRequisition).toHaveBeenCalledWith('req-1', true)
    })

    expect(result.current.isPendingStatus).toBe(true)
    expect(result.current.rows).toHaveLength(1)
  })
})
