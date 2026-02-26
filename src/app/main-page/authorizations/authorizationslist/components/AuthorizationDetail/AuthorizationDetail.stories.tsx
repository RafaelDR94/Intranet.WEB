import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { vi } from 'vitest'

import AuthorizationDetail from './AuthorizationDetail'

const mockUseAuthorizationDetail = vi.fn()

vi.mock('./hooks/useAuthorizationDetail', () => ({
  __esModule: true,
  default: () => mockUseAuthorizationDetail(),
}))

vi.mock('./components/RequisitionsAuthorization/RequisitionsAuthorization', () => ({
  __esModule: true,
  default: () => <div>RequisitionsAuthorization</div>,
}))

vi.mock('./components/ValesAuthorization/ValesAuthorization', () => ({
  __esModule: true,
  default: () => <div>ValesAuthorization</div>,
}))

type StoryArgs = {
  theme?: 'light' | 'dark'
  mode?: 'requisition' | 'vale'
}

const meta: Meta<StoryArgs> = {
  title: 'MainPage/Authorizations/AuthorizationDetail',
  component: AuthorizationDetail,
  tags: ['autodocs'],
  args: {
    theme: 'light',
    mode: 'vale',
  },
  render: (args) => {
    mockUseAuthorizationDetail.mockReturnValue({
      isRequisition: args.mode === 'requisition',
      isVale: args.mode === 'vale',
      kind: args.mode === 'requisition' ? 'Requisicion' : 'Vale',
      normalizedKind: args.mode,
    })

    return (
      <div data-theme={args.theme} style={{ padding: 16 }}>
        <AuthorizationDetail />
      </div>
    )
  },
}

export default meta

type Story = StoryObj<StoryArgs>

export const RequisitionDetail: Story = {
  args: { mode: 'requisition' },
}

export const ValeDetail: Story = {
  args: { mode: 'vale' },
}

export const DarkMode: Story = {
  args: { theme: 'dark', mode: 'vale' },
}
