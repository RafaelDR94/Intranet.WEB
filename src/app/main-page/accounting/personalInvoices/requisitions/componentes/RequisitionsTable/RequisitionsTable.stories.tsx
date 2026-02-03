import type { Meta, StoryObj } from '@storybook/react'

import * as hook from './hooks/useRequisitionsTable'

// Provide static data for Storybook rendering
;
import RequisitionsTable from './RequisitionsTable'
(hook as any).useRequisitionTable = () => ({
  rows: [
    { id: '1', snCode: 'REQ-1', debtorName: 'John Doe', projectCode: 'PRJ-1', date_created: '2025-01-01' },
  ],
  setQuery: () => {},
  confirmOpen: false,
  rowToDelete: null,
  removing: false,
  handleConfirmDelete: () => {},
  setConfirmOpen: () => {},
  onEdit: () => {},
  onDelete: () => {},
  refresh: () => {},
})

const meta: Meta<typeof RequisitionsTable> = {
  title: 'MAINPAGE/Accounting/Requisitions/RequisitionsList/RequisitionsTable/RequisitionsTable',
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
