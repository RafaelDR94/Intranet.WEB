import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import RequisitionsList from './page'

const useSearchParamsMock = vi.fn(() => new URLSearchParams())
const replaceMock = vi.fn()
const pushMock = vi.fn()
const requisitionsListMock = vi.fn()
const editableViaticsTableMock = vi.fn()
const contextualInfoFormMock = vi.fn()

vi.mock('next/navigation', () => ({
  useSearchParams: () => useSearchParamsMock(),
  useRouter: () => ({ replace: replaceMock, push: pushMock }),
}))

vi.mock('./componentes/RequisitionsDetails/RequisitionDetails', () => ({
  __esModule: true,
  default: () => <div>details</div>,
}))

vi.mock('./componentes/RequisitionsTable/RequisitionsTable', () => ({
  __esModule: true,
  default: () => <div>table</div>,
}))

vi.mock('@/app/sharedComponents/ContextualInfoForm/ContextualInfoForm', () => ({
  __esModule: true,
  ContextualInfoForm: (props: any) => {
    contextualInfoFormMock(props)
    return <div>contextual-info-form</div>
  },
}))

vi.mock(
  '@/app/sharedComponents/EditableViaticsTable/EditableViaticsTable',
  () => ({
    __esModule: true,
    EditableViaticsTable: (props: any) => {
      editableViaticsTableMock(props)
      return <div>editable-viatics-table</div>
    },
  }),
)

vi.mock(
  '@/app/main-page/operations/requisitions/requisitionListPage/components/UserRequisitionsList/UserRequisitionsList',
  () => ({
    __esModule: true,
    default: (props: any) => {
      requisitionsListMock(props)
      return <div>user requisitions</div>
    },
  }),
)

describe('RequisitionsList page', () => {
  it('renders contextual info form and editable viatics table by default', () => {
    render(<RequisitionsList />)

    expect(screen.getByText('contextual-info-form')).toBeInTheDocument()
    expect(screen.getByText('editable-viatics-table')).toBeInTheDocument()
    expect(contextualInfoFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          company: 'DISITREK',
          projectCode: 'PY-SEMAR-014',
          debtorCode: '00124',
          clientCode: '00345',
          startDate: '2026-05-10',
          endDate: '2026-05-15',
          assignedPerson: 'Angel Vazquez',
        }),
      }),
    )
    expect(editableViaticsTableMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expect.any(Array),
        onChange: expect.any(Function),
        totalOverride: '7,500',
      }),
    )
  })

  it('renders user requisitions view and injects files handler', () => {
    useSearchParamsMock.mockReturnValueOnce(
      new URLSearchParams('label=Requisiciones%20Bruno&id=emp-1'),
    )

    render(<RequisitionsList />)

    expect(screen.getByText('user requisitions')).toBeInTheDocument()
    expect(requisitionsListMock).toHaveBeenCalledWith(
      expect.objectContaining({
        forceVisible: true,
        userId: 'emp-1',
        onViewFiles: expect.any(Function),
      }),
    )
  })

  it('redirects files view to validate invoices with employee id', async () => {
    useSearchParamsMock.mockReturnValueOnce(
      new URLSearchParams('label=Archivos%20Bruno&idEmployee=emp-1&employeeName=Bruno%20Mendoza'),
    )

    render(<RequisitionsList />)

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith(
        '/main-page/accounting/invoices/validateinvoices?idEmployee=emp-1&employeeName=Bruno+Mendoza',
      )
    })
  })

  it('redirects files view to validate invoices with requisition code when requisition context exists', async () => {
    useSearchParamsMock.mockReturnValueOnce(
      new URLSearchParams('label=Archivos%20REQ-2026-001&idEmployee=emp-1&idRequisition=req-1&requisitionCode=REQ-2026-001&employeeName=Bruno%20Mendoza'),
    )

    render(<RequisitionsList />)

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith(
        '/main-page/accounting/invoices/validateinvoices?idRequisition=req-1&requisitionCode=REQ-2026-001&employeeName=Bruno+Mendoza',
      )
    })
  })
})
