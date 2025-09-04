import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],

}
export default meta

export type Story = StoryObj<typeof Card>

export const LightMode: Story = {
  args: {
    imageSrc: 'image.png',
    label: 'Label',
    title: 'Title',
    description: 'Description',
    onAccept: () => {},
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
