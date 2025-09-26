import type { Meta, StoryObj } from '@storybook/react';

import { NumberControl } from './NumberControl';
const meta: Meta<typeof NumberControl> = {
  title: 'Components/NumberControl',
  component: NumberControl,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof NumberControl>;
export const LightMode: Story = {
  args: {
    label: 'Cantidad',
    helperText: 'Selecciona un valor',
    defaultValue: 2,
    min: 0,
    max: 10,
  },
  decorators: [
    (Story) => (
      <div
        data-theme="light"
        style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}
      >
        <Story />
      </div>
    ),
  ],
};
export const DarkMode: Story = {
  args: {
    label: 'Cantidad',
    helperText: 'Selecciona un valor',
    defaultValue: 2,
    min: 0,
    max: 10,
  },
  decorators: [
    (Story) => (
      <div
        data-theme="dark"
        style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}
      >
        <Story />
      </div>
    ),
  ],
};