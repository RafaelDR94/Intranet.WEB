import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

import RequisitionDetails from './RequisitionDetails'

const perDiemBalanceCardMock = vi.fn(() => <div data-testid='balance' />)
const fetchBillingDocumentByIdRequisition = vi.fn()

vi.mock('./hooks/useRequisitionsDetails', () => ({
  __esModule: true,
  default: () => ({
    currentRequisition: {
      billingrequisition_id: 'req-1',
      assignmentdate: '2025-01-01',
      endDate: '2025-01-02',
      amountdeposited: '100',
      provenamount: '50',
    },
  }),
}))

vi.mock('@/app/main-page/accounting/requisitions/components/RequisitionsForm/RequisitionsForm', () => ({
  __esModule: true,
  default: () => <div data-testid='form' />, 
}))

vi.mock('./components/DemoPerDiemBalanceCard/PerDiemBalanceCard', () => ({
  __esModule: true,
  default: (props: any) => perDiemBalanceCardMock(props), 
}))

vi.mock('./components/DocumentsByRequisition/DocumentsByRequisition', () => ({
  __esModule: true,
  default: () => <div data-testid='docs-by-requisition' />, 
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { showDetails: true, showBalance: true, showDocuments: true } }),
}))

vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: (selector: any) =>
    selector({
      montoComprobado: 80,
      montoAFavorEmpresa: 20,
      montoAFavorColaborador: 0,
      hasPerDiemTotals: true,
      fetchBillingDocumentByIdRequisition,
    }),
}))

describe('RequisitionDetails', () => {
  it('renders form, balance and documents', () => {
    render(<RequisitionDetails />)
    expect(screen.getByTestId('form')).toBeInTheDocument()
    expect(screen.getByTestId('balance')).toBeInTheDocument()
    expect(screen.getByTestId('docs-by-requisition')).toBeInTheDocument()
    expect(fetchBillingDocumentByIdRequisition).toHaveBeenCalledWith('req-1', true)
    expect(perDiemBalanceCardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        requestedAmount: 100,
        verifiedAmount: 80,
        enterpriseAmount: 20,
        employeeAmount: 0,
      }),
    )
  })
})
