import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ToggleButton } from './ToogleButton';

const meta: Meta<typeof ToggleButton> = {
  title: 'Components/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ToggleButton>;

export const LightMode: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(args.checked);
    return <ToggleButton {...args} checked={checked} onChange={setChecked} />;
  },
  args: {
    label: 'Toggle',
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
    return <ToggleButton {...args} checked={checked} onChange={setChecked} />;
  },
  args: {
    label: 'Toggle',
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
