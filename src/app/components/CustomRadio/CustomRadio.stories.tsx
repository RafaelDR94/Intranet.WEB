// src/components/CustomRadio.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import CustomRadio from './CustomRadio';
import { CustomRadioProps } from './types';

const meta: Meta<typeof CustomRadio> = {
  title: 'Components/CustomRadio',
  component: CustomRadio,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof CustomRadio>;

// --- 🎨 Decorators para temas ---

const withLightTheme = (Story: any) => (
  <div
    data-theme="light"
    style={{
      backgroundColor: 'var(--color-gray-10)',
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
      backgroundColor: 'var(--color-gray-10)',
      color: 'var(--color-foreground)',
      minHeight: '50vh',
      padding: '2rem',
    }}
  >
    <Story />
  </div>
);

// --- 🎛️ Componente de ejemplo con estado para historias ---

const RadioGroupExample = (args: Partial<CustomRadioProps>) => {
  const [selected, setSelected] = useState('opcion1');

  return (
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <CustomRadio
        id="opcion1"
        name="grupo1"
        value="opcion1"
        label="Opción 1"
        checked={selected === 'opcion1'}
        onChange={setSelected}
        {...args}
      />
      <CustomRadio
        id="opcion2"
        name="grupo1"
        value="opcion2"
        label="Opción 2"
        checked={selected === 'opcion2'}
        onChange={setSelected}
        {...args}
      />
    </div>
  );
};

// --- 🧪 Historias en modo claro ---

export const GrupoBasicoLight: Story = {
  render: () => <RadioGroupExample name="grupo1" />,
  decorators: [withLightTheme],
};

export const DeshabilitadoLight: Story = {
  render: () => <RadioGroupExample name="grupo2" disabled />,
  decorators: [withLightTheme],
};

// --- 🌙 Historias en modo oscuro ---

export const GrupoBasicoDark: Story = {
  render: () => <RadioGroupExample name="grupo1" />,
  decorators: [withDarkTheme],
};

export const DeshabilitadoDark: Story = {
  render: () => <RadioGroupExample name="grupo2" disabled />,
  decorators: [withDarkTheme],
};
