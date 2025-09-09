import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Control } from './Control';

// --- 🎯 Meta de Storybook ---
const meta: Meta<typeof Control> = {
  title: 'Components/Control',
  component: Control,
  tags: ['autodocs'],
};
export default meta;


type Story = StoryObj<typeof Control>;
// --- 🎨 Decoradores de tema ---

const withTheme = (theme: 'light' | 'dark') => {
  const ThemedDecorator = (Story: any) => (
    <div
      data-theme={theme}
      style={{
        backgroundColor: 'var(--color-gray-10)',
        color: 'var(--color-foreground)',
        minHeight: '30vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Story />
    </div>
  );
  ThemedDecorator.displayName = `withTheme(${theme})`;
  return ThemedDecorator;
};


const withLightTheme = withTheme('light');
const withDarkTheme = withTheme('dark');

// --- 🧪 Control con estado interno para historias ---

const StatefulControl = (props: any) => {
  const [value, setValue] = useState(1);

  return (
    <Control
      {...props}
      value={value}
      onIncrement={() => setValue((v) => v + 1)}
      onDecrement={() => setValue((v) => v - 1)}
    />
  );
};

// --- 🧪 Historias - Modo Claro ---

export const FilledLight: Story = {
  render: () => <StatefulControl variant="filled" />,
  decorators: [withLightTheme],
};

export const OutlinedLight: Story = {
  render: () => <StatefulControl variant="outlined" />,
  decorators: [withLightTheme],
};

// --- 🌙 Historias - Modo Oscuro ---

export const FilledDark: Story = {
  render: () => <StatefulControl variant="filled" />,
  decorators: [withDarkTheme],
};

export const OutlinedDark: Story = {
  render: () => <StatefulControl variant="outlined" />,
  decorators: [withDarkTheme],
};
