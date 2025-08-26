import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from './Tab';

const meta: Meta<typeof Tab> = {
  title: 'Components/Tab',
  component: Tab,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Tab>;

// --- 🎨 Decorator Theme Wrappers ---

const withLightTheme = (Story: any) => (
  <div
    data-theme="light"
    style={{
      color: 'var(--color-foreground)',
      minHeight: '50vh',
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

      color: 'var(--color-foreground)',
      minHeight: '50vh',
      padding: '2rem',
    }}
  >
    <Story />
  </div>
);

// --- ☀️ Historias en Modo Claro ---

export const DefaultLight: Story = {
  args: {
    label: 'Inicio',
    onClick: () => alert('Tab clicked'),
  },
  decorators: [withLightTheme],
};

export const SelectedLight: Story = {
  args: {
    label: 'Seleccionado',
    selected: true,
    onClick: () => alert('Tab seleccionado'),
  },
  decorators: [withLightTheme],
};

export const DisabledLight: Story = {
  args: {
    label: 'Deshabilitado',
    disabled: true,
    onClick: () => alert('No debería activarse'),
  },
  decorators: [withLightTheme],
};

export const InteractiveStatesLight: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tab label="Normal" onClick={() => alert('Normal')} />
      <Tab label="Seleccionado" selected onClick={() => alert('Seleccionado')} />
      <Tab label="Deshabilitado" disabled onClick={() => alert('No debe activarse')} />
    </div>
  ),
  decorators: [withLightTheme],
};

// --- 🌙 Historias en Modo Oscuro ---

export const DefaultDark: Story = {
  ...DefaultLight,
  decorators: [withDarkTheme],
};

export const SelectedDark: Story = {
  ...SelectedLight,
  decorators: [withDarkTheme],
};

export const DisabledDark: Story = {
  ...DisabledLight,
  decorators: [withDarkTheme],
};

export const InteractiveStatesDark: Story = {
  ...InteractiveStatesLight,
  decorators: [withDarkTheme],
};
