import type { Meta, StoryObj } from '@storybook/react'
import { ContextMenu } from './ContextMenu'

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],

}
export default meta

type Story = StoryObj<typeof ContextMenu>

export const LightMode: Story = {
  args: {
    trigger: <button>Open</button>,
    items: [{ label: 'Item 1' }, { label: 'Item 2' }],
  },
  decorators: [
    (Story) => (
      <div data-theme="light" style={{ backgroundColor: 'var(--color-gray-10)', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export const DarkMode: Story = {
  ...LightMode,
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}
