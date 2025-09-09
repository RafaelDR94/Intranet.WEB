import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { vi } from 'vitest'

import RequisitionDetailsDocument from './RequisitionDetailsDocument'

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

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: ({ tables }: any) => <div>{tables[0].data[0].description}</div>,
}))

vi.mock('@/app/components/LoadingOverLay/LoadingOverlay', () => ({ default: () => null }))
vi.mock('@/app/main-page/accounting/invoices/validateinvoices/components/DetailsPanel/DetailsPanel', () => ({ __esModule: true, default: () => null }))
vi.mock('@/app/components/Button/Button', () => ({ Button: (props: any) => <button {...props} /> }))
vi.mock('@/app/context/AuthContext/AuthContext', () => ({ useAuth: () => ({ currentPagePermissions: { downloadDocuments: true } }) }))

const meta: Meta<typeof RequisitionDetailsDocument> = {
  title: 'MainPage/Accounting/Requisitions/RequisitionDetailsDocument',
  component: RequisitionDetailsDocument,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RequisitionDetailsDocument>

export const Default: Story = {
  decorators: [Story => <div data-theme="light"><Story /></div>],
}

export const DarkMode: Story = {
  decorators: [Story => <div data-theme="dark"><Story /></div>],
}
