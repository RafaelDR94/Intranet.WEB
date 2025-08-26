import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const LightMode: Story = {
  args: {
    title: 'Alerta',
    description: 'Descripción de la alerta',
    type: 'default',
    variant: 'filled',
  },
  decorators: [
    (Story) => (
      <div data-theme="light" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    title: 'Alerta',
    description: 'Descripción de la alerta',
    type: 'default',
    variant: 'filled',
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};
