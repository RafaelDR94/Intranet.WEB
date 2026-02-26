import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { vi } from 'vitest'

import type { ColumnDefinition } from '@/app/components/DataTable/types'

import AuthorizationList from './AuthorizationList'
import type { AuthorizationListRow } from './types'

const mockUseAuthorizationList = vi.fn()

vi.mock('./hooks/useAuthorizationList', () => ({
  __esModule: true,
  default: () => mockUseAuthorizationList(),
}))

const rows: AuthorizationListRow[] = [
  {
    id: 'auth-1',
    eventId: 'evt-1',
    enterprise: 'DR Security',
    department: 'Compras',
    applicant: 'Mariana Lopez',
    kind: 'Requisición',
    project: 'DR-001',
    date: '12/02/2026',
    status: 'Pendiente',
    dateRaw: '2026-02-12',
  },
  {
    id: 'auth-2',
    eventId: 'evt-2',
    enterprise: 'VIP',
    department: 'Tesorería',
    applicant: 'Carlos Ruiz',
    kind: 'Vale Azul',
    project: 'VIP-234',
    date: '11/02/2026',
    status: 'Aprobada',
    dateRaw: '2026-02-11',
  },
]

const columns: ColumnDefinition<AuthorizationListRow>[] = [
  { key: 'enterprise', label: 'EMPRESA' },
  { key: 'department', label: 'DEPARTAMENTO' },
  { key: 'applicant', label: 'SOLICITANTE' },
  { key: 'kind', label: 'TIPO' },
  { key: 'project', label: 'PROYECTO' },
  { key: 'date', label: 'FECHA' },
  { key: 'status', label: 'ESTATUS' },
]

type StoryArgs = {
  theme?: 'light' | 'dark'
}

const meta: Meta<StoryArgs> = {
  title: 'MainPage/Authorizations/AuthorizationList',
  component: AuthorizationList,
  tags: ['autodocs'],
  args: {
    theme: 'light',
  },
  render: (args) => {
    mockUseAuthorizationList.mockReturnValue({
      columns,
      rows,
      filterOptions: [
        { label: 'Todos', value: 'all' },
        { label: 'Pendiente', value: 'pendiente' },
      ],
      filterValue: 'all',
      handleFilterChange: vi.fn(),
      handleRefresh: vi.fn(),
    })

    return (
      <div data-theme={args.theme} style={{ padding: 16 }}>
        <AuthorizationList />
      </div>
    )
  },
}

export default meta

type Story = StoryObj<StoryArgs>

export const Light: Story = {}

export const Dark: Story = {
  args: { theme: 'dark' },
}
