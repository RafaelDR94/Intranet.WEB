import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { vi } from 'vitest'

import RequisitionsAuthorization from './RequisitionsAuthorization'

const mockUseRequisitionsAuthorization = vi.fn()

vi.mock('./hooks/useRequisitionsAuthorization', () => ({
  __esModule: true,
  default: () => mockUseRequisitionsAuthorization(),
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

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} />
  ),
}))

type StoryArgs = {
  theme?: 'light' | 'dark'
  pending?: boolean
}

const meta: Meta<StoryArgs> = {
  title:
    'MainPage/Authorizations/AuthorizationDetail/RequisitionsAuthorization',
  component: RequisitionsAuthorization,
  tags: ['autodocs'],
  args: {
    theme: 'light',
    pending: true,
  },
  render: (args) => {
    mockUseRequisitionsAuthorization.mockReturnValue({
      requisitionId: 'req-1',
      requisition: {
        requisitionkey: 'REQ-001',
        state: 'MX',
        projectname: 'Proyecto Demo',
        gts_type: 'GTS',
        motive: 'Viaje de trabajo',
        employeename: 'Ana Perez',
        assignmentdate: '2026-02-01',
        endDate: '2026-02-05',
      },
      rows: [],
      columns: [],
      activeFilter: 'pending-current-authorization',
      setActiveFilter: vi.fn(),
      filterOptions: [
        { label: 'Todas', value: 'all' },
        { label: 'Pendientes de esta autorización', value: 'pending-current-authorization' },
      ],
      periodLabel: '01/02/2026 al 05/02/2026',
      verificationDate: '05/02/2026',
      requestedAmountLabel: '$1,000.00',
      verifiedAmountLabel: '$900.00',
      favorEmpresaLabel: '$100.00',
      favorColaboradorLabel: '-',
      downloadRequistionResume: vi.fn(),
      authorizerId: 'auth-1',
      authorizationStatus: args.pending ? 'Pendiente' : 'Aprobada',
      isPendingStatus: args.pending,
      isRejectedStatus: false,
      authorizationComment: '',
      signatureOpen: false,
      setSignatureOpen: vi.fn(),
      rejectCommentOpen: false,
      rejectComment: '',
      rejectCommentError: null,
      handleStartApproval: vi.fn(),
      handleStartRejection: vi.fn(),
      handleSignatureAuthorization: vi.fn(),
      handleRejectCommentChange: vi.fn(),
      handleRejectCommentSubmit: vi.fn(),
      handleRejectCommentCancel: vi.fn(),
    })

    return (
      <div data-theme={args.theme} style={{ padding: 16 }}>
        <RequisitionsAuthorization />
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
