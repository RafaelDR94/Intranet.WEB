import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

// --- 🎯 Meta Storybook ---
const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

// --- 🎨 Theme Decorators ---

const withLightTheme = (Story: any) => (
  <div
    data-theme="light"
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

const withDarkTheme = (Story: any) => (
  <div
    data-theme="dark"
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

// --- 🧪 Historias Light Mode ---

export const TopLight: Story = {
  args: {
    text: 'Tooltip arriba',
    position: 'top',
    children: (
      <button className="px-4 py-2 bg-green-90 text-white rounded">
        Hover aquí
      </button>
    ),
  },
  decorators: [withLightTheme],
};

export const RightLight: Story = {
  args: {
    text: 'Tooltip derecha',
    position: 'right',
    children: (
      <button className="px-4 py-2 bg-green-90 text-white rounded">
        Hover aquí
      </button>
    ),
  },
  decorators: [withLightTheme],
};

export const BottomLight: Story = {
  args: {
    text: 'Tooltip abajo',
    position: 'bottom',
    children: (
      <button className="px-4 py-2 bg-green-90 text-white rounded">
        Hover aquí
      </button>
    ),
  },
  decorators: [withLightTheme],
};

export const LeftLight: Story = {
  args: {
    text: 'Tooltip izquierda',
    position: 'left',
    children: (
      <button className="px-4 py-2 bg-green-90 text-white rounded">
        Hover aquí
      </button>
    ),
  },
  decorators: [withLightTheme],
};

// --- 🌙 Historias Dark Mode ---

export const TopDark: Story = {
  ...TopLight,
  decorators: [withDarkTheme],
};

export const RightDark: Story = {
  ...RightLight,
  decorators: [withDarkTheme],
};

export const BottomDark: Story = {
  ...BottomLight,
  decorators: [withDarkTheme],
};

export const LeftDark: Story = {
  ...LeftLight,
  decorators: [withDarkTheme],
};
