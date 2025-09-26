import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

// --- 🎨 Decorators para Light & Dark Mode ---

const withLightTheme = (Story: any) => (
  <div
    data-theme="light"
    style={{
      backgroundColor: 'var(--color-gray-10)',
      color: 'var(--color-foreground)',
      minHeight: '30vh',
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
      padding: '2rem',
    }}
  >
    <Story />
  </div>
);

//
// --- ☀️ Historias en Modo Claro ---
//

export const DefaultLight: Story = {
  args: {
    value: 50,
    showPercentage: true,
  },
  decorators: [withLightTheme],
};

export const CustomLabelLight: Story = {
  args: {
    value: 30,
    label: 'Cargando...',
    showPercentage: true,
  },
  decorators: [withLightTheme],
};

export const NoPercentageLight: Story = {
  args: {
    value: 70,
    showPercentage: false,
  },
  decorators: [withLightTheme],
};

export const FullProgressLight: Story = {
  args: {
    value: 100,
  },
  decorators: [withLightTheme],
};

export const ZeroProgressLight: Story = {
  args: {
    value: 0,
  },
  decorators: [withLightTheme],
};

//
// --- 🌙 Historias en Modo Oscuro ---
//

export const DefaultDark: Story = {
  ...DefaultLight,
  decorators: [withDarkTheme],
};

export const CustomLabelDark: Story = {
  ...CustomLabelLight,
  decorators: [withDarkTheme],
};

export const NoPercentageDark: Story = {
  ...NoPercentageLight,
  decorators: [withDarkTheme],
};

export const FullProgressDark: Story = {
  ...FullProgressLight,
  decorators: [withDarkTheme],
};

export const ZeroProgressDark: Story = {
  ...ZeroProgressLight,
  decorators: [withDarkTheme],
};
