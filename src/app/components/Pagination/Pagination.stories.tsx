import type { Meta, StoryObj } from '@storybook/react';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Pagination>;

export const LightMode: Story = {
  args: { currentPage: 1, totalPages: 5, onPageChange: () => {} },
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
  args: { currentPage: 1, totalPages: 5, onPageChange: () => {} },
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
