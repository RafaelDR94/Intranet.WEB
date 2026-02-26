import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import ValesAuthorization from './ValesAuthorization'
import useValesAuthorization from './hooks/useValesAuthorization'

vi.mock('./hooks/useValesAuthorization', () => ({
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

vi.mock('@/assets/svgs/TicketAzul.svg', () => ({
  __esModule: true,
  default: () => <div data-testid="ticket-azul" />,
}))

vi.mock('@/assets/svgs/TicketsRosa.svg', () => ({
  __esModule: true,
  default: () => <div data-testid="ticket-rosa" />,
}))

describe('ValesAuthorization', () => {
  const mockHook = useValesAuthorization as unknown as Mock
  const handleStartApproval = vi.fn()
  const handleStartRejection = vi.fn()

  beforeEach(() => {
    handleStartApproval.mockClear()
    handleStartRejection.mockClear()
    mockHook.mockReset()
    mockHook.mockReturnValue({
      title: 'Aprobacion Vale',
      voucher: { voucher_type: 'Vale Azul' },
      rows: [],
      columns: [],
      activeFilter: 'all',
      setActiveFilter: vi.fn(),
      statusLabelType: 'pendiente',
      voucherLabelType: 'vale-azul',
      formattedAmount: '$1,000.00',
      formattedSubtotal: '$900.00',
      formattedIva: '$100.00',
      formattedTotal: '$1,000.00',
      formattedDate: '12/02/2026',
      projectCode: 'PR-01',
      collaborator: 'Luis Garcia',
      voucherUuid: 'UUID-123',
      rfcEmisor: 'AAA',
      rfcReceptor: 'BBB',
      concept: 'Materiales',
      authorizerId: 'auth-1',
      authorizationStatus: 'Pendiente',
      isPendingStatus: true,
      isRejectedStatus: false,
      authorizationComment: '',
      attachments: { evidence: '', xml: '', pdf: '' },
      signatureOpen: false,
      setSignatureOpen: vi.fn(),
      rejectCommentOpen: false,
      rejectComment: '',
      rejectCommentError: null,
      authorizerPopUpOpen: false,
      authorizerSelected: '',
      authorizerOptions: [],
      authorizerError: null,
      handleStartApproval,
      handleStartRejection,
      handleSignatureAuthorization: vi.fn(),
      handleRejectCommentChange: vi.fn(),
      handleRejectCommentSubmit: vi.fn(),
      handleRejectCommentCancel: vi.fn(),
      handleOpenEscalate: vi.fn(),
      handleCancelEscalate: vi.fn(),
      handleConfirmEscalate: vi.fn(),
      setAuthorizerSelected: vi.fn(),
    })
  })

  it('ejecuta acciones de aprobar y rechazar', () => {
    render(<ValesAuthorization />)
    fireEvent.click(screen.getByText('Rechazar'))
    fireEvent.click(screen.getByText('Aprobar'))
    expect(handleStartRejection).toHaveBeenCalledTimes(1)
    expect(handleStartApproval).toHaveBeenCalledTimes(1)
  })
})
