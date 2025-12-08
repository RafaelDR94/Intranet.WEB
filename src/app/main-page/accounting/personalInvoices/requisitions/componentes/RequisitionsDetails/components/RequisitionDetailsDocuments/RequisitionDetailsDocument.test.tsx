import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

const pushMock = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => ({
    get: (key: string) => (key === 'label' ? 'Detalle Requisición' : null),
  }),
}))

vi.mock('./hooks/useRequisitionDetailsDocument', () => ({
  __esModule: true,
  default: () => ({
    rows: [{ billingdocument_id: 'b1', description: 'desc', status: 'Pendiente' }],
    selected: null,
    panelOpen: false,
    downloadRequistionResume: vi.fn(),
    handleOpenDetails: vi.fn(),
    setPanelOpen: vi.fn(),
    requisitionId: '1',
    loading: false,
    downloadingDocument: false,
  }),
}))

vi.mock('../DetailsPanel/DetailsPanel', () => ({
  __esModule: true,
  default: () => null,
}))

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: ({ tables, rightContent }: any) => (
    <div>
      <div data-testid='row'>{tables[0].data[0].description}</div>
      {rightContent}
    </div>
  ),
}))

vi.mock('@/app/components/LoadingOverLay/LoadingOverlay', () => ({
  default: () => null,
}))

vi.mock('@/app/main-page/accounting/invoices/validateinvoices/components/DetailsPanel/DetailsPanel', () => ({
  __esModule: true,
  default: () => null,
}))

vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ hideIcon, ...props }: any) => <button {...props} />,
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { downloadDocuments: true } }),
}))

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert: vi.fn() },
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
  }),
}))

import RequisitionDetailsDocument from './RequisitionDetailsDocument'

describe('RequisitionDetailsDocument', () => {
  it('renders rows from hook', () => {
    render(<RequisitionDetailsDocument />)
    expect(screen.getByTestId('row')).toHaveTextContent('desc')
  })

  it('navigates to billable files tab when clicking upload button', () => {
    render(<RequisitionDetailsDocument />)

    fireEvent.click(screen.getByRole('button', { name: 'Subir Archivos' }))

    expect(pushMock).toHaveBeenCalledWith(
      '/main-page/accounting/billablefiles/billablefiles?id=1&label=Detalle+Requisici%C3%B3n',
    )
  })
})
