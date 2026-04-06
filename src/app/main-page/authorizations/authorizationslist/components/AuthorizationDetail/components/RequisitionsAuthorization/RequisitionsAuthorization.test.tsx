import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import RequisitionsAuthorization from './RequisitionsAuthorization'
import useRequisitionsAuthorization from './hooks/useRequisitionsAuthorization'

vi.mock('./hooks/useRequisitionsAuthorization', () => ({
  __esModule: true,
  default: vi.fn(),
}))

vi.mock('@/app/components/DataTable/DataTable', () => ({
  __esModule: true,
  DataTable: () => <div data-testid="datatable" />,
}))

vi.mock('@/app/components/SignaturePopUp/SignaturePopUp', () => ({
  __esModule: true,
  default: () => <div data-testid="signature-popup" />,
}))

vi.mock('@/app/components/PopUp/PopUp', () => ({
  __esModule: true,
  PopUp: (props: any) => (props.open ? <div>{props.title}</div> : null),
}))

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img alt={props.alt} src={props.src} />,
}))

describe('RequisitionsAuthorization', () => {
  const mockHook = useRequisitionsAuthorization as unknown as Mock
  const handleStartApproval = vi.fn()
  const handleStartRejection = vi.fn()

  beforeEach(() => {
    handleStartApproval.mockClear()
    handleStartRejection.mockClear()
    mockHook.mockReset()
    mockHook.mockReturnValue({
      requisitionId: 'req-1',
      requisition: { requisitionkey: 'REQ-001' },
      rows: [],
      columns: [],
      activeFilter: 'pending-current-authorization',
      setActiveFilter: vi.fn(),
      filterOptions: [
        { label: 'Todas', value: 'all' },
        { label: 'Documentos de la autorización', value: 'pending-current-authorization' },
      ],
      periodLabel: '01/02/2026 al 05/02/2026',
      verificationDate: '05/02/2026',
      requestedAmountLabel: '$1,000.00',
      verifiedAmountLabel: '$900.00',
      favorEmpresaLabel: '$100.00',
      favorColaboradorLabel: '-',
      downloadRequistionResume: vi.fn(),
      authorizerId: 'auth-1',
      authorizationStatus: 'Pendiente',
      isPendingStatus: true,
      isRejectedStatus: false,
      authorizationComment: '',
      signatureOpen: false,
      setSignatureOpen: vi.fn(),
      rejectCommentOpen: false,
      rejectComment: '',
      rejectCommentError: null,
      handleStartApproval,
      handleStartRejection,
      handleSignatureAuthorization: vi.fn(),
      handleRejectCommentChange: vi.fn(),
      handleRejectCommentSubmit: vi.fn(),
      handleRejectCommentCancel: vi.fn(),
    })
  })

  it('muestra acciones de aprobar y rechazar cuando esta pendiente', () => {
    render(<RequisitionsAuthorization />)
    fireEvent.click(screen.getByText('Rechazar'))
    fireEvent.click(screen.getByText('Aprobar'))
    expect(handleStartRejection).toHaveBeenCalledTimes(1)
    expect(handleStartApproval).toHaveBeenCalledTimes(1)
  })
})

