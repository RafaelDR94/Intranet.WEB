import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useRequisitionsAuthorization from './useRequisitionsAuthorization'

const fetchCurrentRequisition = vi.fn()
const fetchBillingDocumentByIdRequisition = vi.fn()
const getAuthorizationBillingDocuments = vi.fn()
const getAuthorizations = vi.fn()
const approveAuthorization = vi.fn()
const mappedRowsMock = vi.fn(() => [{ billingdocument_id: 'doc-1', fecha: '2026-02-02', authorization: null }])

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
    authorizationBillingDocuments: [],
    loadingBillingDocuments: false,
    getAuthorizationBillingDocuments,
    getAuthorizations,
    approveAuthorization,
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
  BillingDocumentDetailsTableListMap: (...args: unknown[]) => mappedRowsMock(...args),
}))

describe('useRequisitionsAuthorization', () => {
  beforeEach(() => {
    mappedRowsMock.mockReset()
    fetchCurrentRequisition.mockReset()
    fetchBillingDocumentByIdRequisition.mockReset()
    getAuthorizationBillingDocuments.mockReset()
    getAuthorizations.mockReset()
    approveAuthorization.mockReset()
  })

  it('carga requisicion y documentos al iniciar', async () => {
    mappedRowsMock.mockReturnValue([
      { billingdocument_id: 'doc-1', fecha: '2026-02-02', authorization: null },
    ])

    const { result } = renderHook(() => useRequisitionsAuthorization())

    await waitFor(() => {
      expect(fetchCurrentRequisition).toHaveBeenCalledWith('req-1')
      expect(fetchBillingDocumentByIdRequisition).toHaveBeenCalledWith('req-1', true)
    })

    expect(result.current.isPendingStatus).toBe(true)
    expect(result.current.rows).toHaveLength(0)
    act(() => {
      result.current.setActiveFilter('all')
    })
    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0]?.status).toBe('Pendiente')
  })

  it('muestra documentos autorizados de la misma autorización por default', async () => {
    mappedRowsMock.mockReturnValue([
      {
        billingdocument_id: 'doc-1',
        fecha: '2026-02-02',
        authorization: { authorization_id: 'auth-1', status: { name: 'Aprobada' } },
      },
    ])

    const { result } = renderHook(() => useRequisitionsAuthorization())

    await waitFor(() => {
      expect(result.current.rows).toHaveLength(1)
    })

    expect(result.current.rows[0]?.status).toBe('Aprobada')
  })

  it('filtra por documentos de esta autorización usando authorization_id sin importar status', async () => {
    mappedRowsMock.mockReturnValue([
      {
        billingdocument_id: 'doc-1',
        fecha: '2026-02-02',
        authorization: { authorization_id: 'auth-1', status: { name: 'Pendiente' } },
      },
      {
        billingdocument_id: 'doc-2',
        fecha: '2026-02-02',
        authorization: { authorization_id: 'auth-1', status: { name: 'Aprobada' } },
      },
      {
        billingdocument_id: 'doc-3',
        fecha: '2026-02-02',
        authorization: { authorization_id: 'auth-2', status: { name: 'Pendiente' } },
      },
    ])

    const { result } = renderHook(() => useRequisitionsAuthorization())

    await waitFor(() => {
      expect(result.current.rows).toHaveLength(2)
    })

    expect(result.current.rows[0]?.id).toBe('doc-1')
    expect(result.current.rows[1]?.id).toBe('doc-2')
  })

  it('refresca documentos de requisición después de aprobar con éxito', async () => {
    approveAuthorization.mockResolvedValue(true)
    mappedRowsMock.mockReturnValue([
      { billingdocument_id: 'doc-1', fecha: '2026-02-02', authorization: null },
    ])

    const { result } = renderHook(() => useRequisitionsAuthorization())

    act(() => {
      result.current.handleStartApproval()
    })

    await act(async () => {
      await result.current.handleSignatureAuthorization({ state: true } as any)
    })

    await waitFor(() => {
      expect(approveAuthorization).toHaveBeenCalledWith('auth-1')
      expect(getAuthorizations).toHaveBeenCalledWith(true)
      expect(fetchBillingDocumentByIdRequisition).toHaveBeenCalledWith('req-1', true)
    })
  })
})
