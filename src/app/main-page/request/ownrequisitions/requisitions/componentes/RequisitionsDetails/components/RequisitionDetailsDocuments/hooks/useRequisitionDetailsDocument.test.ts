import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import useRequisitionDetailsDocument from './useRequisitionDetailsDocument'

vi.mock('@/tutorials/engine/TutorialProvider', () => ({
  __esModule: true,
  useTutorials: () => ({ activeTutorialId: null }),
}))

const fetchBilling = vi.fn()
const downloadRequistionResume = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => '/main-page/accounting/personalInvoices/requisitions',
  useSearchParams: () => new URLSearchParams('id=1'),
}))

const billingDoc = { billingdocument_id: 'b1', xmlUrl: '', pdfUrl: '', status: 'Pendiente' } as any

vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: (sel: any) =>
    sel({
      fetchBillingDocumentByIdRequisition: fetchBilling,
      billingDocuments: [billingDoc],
      loading: false,
      error: undefined,
    }),
}))


vi.mock('@/app/stores/useRequisitionStore/useRequisitionStore', () => ({
  useRequisitionsStore: (sel: any) =>
    sel({
      downloadingDocument: false,
      succesDownloadDocument: false,
      downloadRequistionResume,
      downloaderror: undefined,
    }),
}))

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({ usePrincipalAlert: { showAlert: vi.fn() } }),
}))

describe('useRequisitionDetailsDocument', () => {
  it('fetches documents and handles open details', () => {
    const { result } = renderHook(() => useRequisitionDetailsDocument())
    expect(fetchBilling).toHaveBeenCalledWith('1', true)
    act(() => result.current.handleOpenDetails(billingDoc))
    expect(result.current.panelOpen).toBe(true)
    expect(result.current.selected?.billingdocument_id).toBe('b1')
  })
})
