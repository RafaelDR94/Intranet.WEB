import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const LightMode: Story = {
  args: {
    initials: 'JD',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div
        data-theme="light"
        style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', padding: '1rem' }}
      >
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    initials: 'JD',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div
        data-theme="dark"
        style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', padding: '1rem' }}
      >
        <Story />
      </div>
    ),
  ],
};
