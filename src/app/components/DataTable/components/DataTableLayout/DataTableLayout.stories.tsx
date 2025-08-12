import type { Meta, StoryObj } from '@storybook/react';
import DataTableLayout from './DataTableLayout';

const meta: Meta<typeof DataTableLayout> = {
  title: 'Components/DataTable/DataTableLayout',
  component: DataTableLayout,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DataTableLayout>;

export const LightMode: Story = {
  args: {
    showFilter: true,
    actionLabel: 'Agregar',
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
    showFilter: true,
    actionLabel: 'Agregar',
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
