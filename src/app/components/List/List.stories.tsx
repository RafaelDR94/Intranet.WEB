import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import List from './List'

// Deriva las props reales del componente
type ListProps = ComponentProps<typeof List>

// Si List tiene prop "items", usamos su tipo exacto:
const sampleItems: ListProps['items'] = [
  { id: 1, label: 'Item 1', controlType: 'badge', showAvatar: false },
  { id: 2, label: 'Item 2', controlType: 'details', showAvatar: false },
]

const meta = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],

} satisfies Meta<typeof List>
export default meta

type Story = StoryObj<typeof meta>

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
