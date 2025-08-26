import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Select } from './Select';
import { SelectOption } from './types';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Select>;

const options: SelectOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

export const LightMode: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<string[]>(args.selected);
    return <Select {...args} selected={selected} onChange={setSelected} />;
  },
  args: {
    options,
    selected: [],
    placeholder: 'Selecciona',
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
    const [selected, setSelected] = React.useState<string[]>(args.selected);
    return <Select {...args} selected={selected} onChange={setSelected} />;
  },
  args: {
    options,
    selected: [],
    placeholder: 'Selecciona',
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};
export const MultipleLight: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<string[]>(args.selected);
    return <Select {...args} multiple selected={selected} onChange={setSelected} />;
  },
  args: {
    options,
    selected: [],
    placeholder: 'Selecciona',
  },
  decorators: [
    (Story) => (
      <div data-theme="light" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const MultipleDark: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<string[]>(args.selected);
    return <Select {...args} multiple selected={selected} onChange={setSelected} />;
  },
  args: {
    options,
    selected: [],
    placeholder: 'Selecciona',
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};