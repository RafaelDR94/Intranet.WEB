import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Checkbox } from './CheckBox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const LightMode: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(args.checked);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
  args: {
    label: 'Acepto',
    checked: false,
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
  render: (args) => {
    const [checked, setChecked] = React.useState(args.checked);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
  args: {
    label: 'Acepto',
    checked: false,
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};
