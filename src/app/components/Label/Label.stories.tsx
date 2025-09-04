import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './Label'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  
}
export default meta

type Story = StoryObj<typeof Label>

export const LightMode: Story = {
  args: { type: 'valido', text: 'Etiqueta' },
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
