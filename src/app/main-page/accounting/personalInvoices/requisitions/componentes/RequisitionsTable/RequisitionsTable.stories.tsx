import type { Meta, StoryObj } from '@storybook/react'
import type { useRequisitionTable as UseRequisitionTable } from './hooks/useRequisitionsTable'
import type { RequisitionRow } from './types'
import { vi } from 'vitest'

import RequisitionsTable from './RequisitionsTable'

const baseRows: RequisitionRow[] = [
  {
    id: '1',
    snCode: 'REQ-1',
    requisitionkey: 'REQ-1',
    debtorName: 'John Doe',
    employeeName: 'John Doe',
    projectCode: 'PRJ-1',
    projectname: 'PRJ-1',
    date_created: '2025-01-01',
  },
]

const mockState: ReturnType<typeof UseRequisitionTable> = {
  rows: baseRows,
  setQuery: () => {},
  confirmOpen: false,
  rowToDelete: null,
  removing: false,
  handleConfirmDelete: async () => {},
  setConfirmOpen: () => {},
  onEdit: () => {},
  onDelete: () => {},
  refresh: () => {},
  activeRows: [],
  query: '',
  columns: [],
  handleOpenDetails: () => {},
  hasIdParam: false,
}

vi.mock('./hooks/useRequisitionsTable', () => ({
  __esModule: true,
  useRequisitionTable: () => mockState,
}))

const meta: Meta<typeof RequisitionsTable> = {
  title: 'MainPage/Accounting/PersonalInvoices/Requisitions/RequisitionsTable/RequisitionsTable',
  component: RequisitionsTable,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RequisitionsTable>

export const LightMode: Story = {
  decorators: [
    (Story) => (
      <div data-theme="light" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}
