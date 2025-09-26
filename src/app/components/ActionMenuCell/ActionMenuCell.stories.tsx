import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { vi } from 'vitest'

import ActionMenuCell from './ActionMenuCell'

// Mocks para el entorno de storybook
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { details: true, delete: true } }),
}))
vi.mock('../DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
}))

const meta: Meta<typeof ActionMenuCell<any>> = {
  title: 'Components/ActionMenuCell',
  component: ActionMenuCell as any,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ActionMenuCell<any>>

const row = { id: '1', name: 'Proyecto X' }

export const Default: Story = {
  args: {
    row,
    onEdit: (r: any) => alert(`Editar: ${r.name}`),
    onDelete: (r: any) => alert(`Eliminar: ${r.name}`),
  },
}

export const Mobile: Story = {
  decorators: [Story => {
    vi.doMock('../DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({ useIsMobile: () => true }))
    return <div data-theme="light"><Story /></div>
  }],
}

