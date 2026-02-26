import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { vi } from 'vitest'

import ValesAuthorization from './ValesAuthorization'

const mockUseValesAuthorization = vi.fn()

vi.mock('./hooks/useValesAuthorization', () => ({
  __esModule: true,
  default: () => mockUseValesAuthorization(),
}))

vi.mock('@/app/components/DataTable/DataTable', () => ({
  __esModule: true,
  DataTable: () => <div>DataTableMock</div>,
}))

vi.mock('@/app/components/SignaturePopUp/SignaturePopUp', () => ({
  __esModule: true,
  default: () => <div>SignaturePopUp</div>,
}))

vi.mock('@/app/components/PopUp/PopUp', () => ({
  __esModule: true,
  PopUp: (props: any) => (props.open ? <div>{props.title}</div> : null),
}))

type StoryArgs = {
  theme?: 'light' | 'dark'
  pending?: boolean
}

const meta: Meta<StoryArgs> = {
  title: 'MainPage/Authorizations/AuthorizationDetail/ValesAuthorization',
  component: ValesAuthorization,
  tags: ['autodocs'],
  args: {
    theme: 'light',
    pending: true,
  },
  render: (args) => {
    mockUseValesAuthorization.mockReturnValue({
      title: 'Aprobacion Vale Azul',
      voucher: {
        voucher_type: 'Vale Azul',
      },
      rows: [],
      columns: [],
      activeFilter: 'all',
      setActiveFilter: vi.fn(),
      statusLabelType: 'pendiente',
      voucherLabelType: 'vale-azul',
      formattedAmount: '$1,200.00',
      formattedSubtotal: '$1,034.00',
      formattedIva: '$166.00',
      formattedTotal: '$1,200.00',
      formattedDate: '12/02/2026',
      projectCode: 'PR-01',
      collaborator: 'Luis Garcia',
      voucherUuid: 'UUID-123',
      rfcEmisor: 'AAA010101AAA',
      rfcReceptor: 'BBB010101BBB',
      concept: 'Materiales',
      authorizerId: 'auth-1',
      authorizationStatus: args.pending ? 'Pendiente' : 'Aprobada',
      isPendingStatus: args.pending,
      isRejectedStatus: false,
      authorizationComment: '',
      attachments: {
        evidence: '',
        xml: '',
        pdf: '',
      },
      signatureOpen: false,
      setSignatureOpen: vi.fn(),
      rejectCommentOpen: false,
      rejectComment: '',
      rejectCommentError: null,
      authorizerPopUpOpen: false,
      authorizerSelected: '',
      authorizerOptions: [],
      authorizerError: null,
      handleStartApproval: vi.fn(),
      handleStartRejection: vi.fn(),
      handleSignatureAuthorization: vi.fn(),
      handleRejectCommentChange: vi.fn(),
      handleRejectCommentSubmit: vi.fn(),
      handleRejectCommentCancel: vi.fn(),
      handleOpenEscalate: vi.fn(),
      handleCancelEscalate: vi.fn(),
      handleConfirmEscalate: vi.fn(),
      setAuthorizerSelected: vi.fn(),
    })

    return (
      <div data-theme={args.theme} style={{ padding: 16 }}>
        <ValesAuthorization />
      </div>
    )
  },
}

export default meta

type Story = StoryObj<StoryArgs>

export const Pending: Story = {}

export const Approved: Story = {
  args: { pending: false },
}

export const DarkMode: Story = {
  args: { theme: 'dark' },
}
