import type { Meta, StoryObj } from '@storybook/react'
import List from './List'

const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Lista de elementos con opciones para acciones y controles.',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof List>

const sampleItems = [
  { id: 1, label: 'Item 1', controlType: 'badge', showAvatar: false },
  { id: 2, label: 'Item 2', controlType: 'details', showAvatar: false },
]

export const LightMode: Story = {
  args: { items: sampleItems },
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
