import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { vi } from 'vitest'

import RequisitionDetails from './RequisitionDetails'

vi.mock('./hooks/useRequisitionsDetails', () => ({
  __esModule: true,
  default: () => ({
    currentRequisition: {
      id: '1',
      assignmentdate: '2025-01-01',
      endDate: '2025-01-02',
      amountdeposited: '100',
      provenamount: '50',
    },
  }),
}))

vi.mock('../../../components/RequisitionsForm/RequisitionsForm', () => ({
  __esModule: true,
  default: () => <div>Form</div>,
}))

vi.mock('./components/DemoPerDiemBalanceCard/PerDiemBalanceCard', () => ({
  __esModule: true,
  default: () => <div>Balance</div>,
}))

vi.mock('./components/RequisitionDetailsDocuments/RequisitionDetailsDocument', () => ({
  __esModule: true,
  default: () => <div>Docs</div>,
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { showDetails: true, showBalance: true, showDocuments: true } }),
}))

const meta: Meta<typeof RequisitionDetails> = {
  title: 'MainPage/Accounting/PersonalInvoices/Requisitions/RequisitionDetails/RequisitionDetails',
  component: RequisitionDetails,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RequisitionDetails>

export const Default: Story = {
  decorators: [Story => <div data-theme="light"><Story /></div>],
}

export const DarkMode: Story = {
  decorators: [Story => <div data-theme="dark"><Story /></div>],
}
