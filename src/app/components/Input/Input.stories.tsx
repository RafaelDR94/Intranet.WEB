import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './Input';

import CheckIcon from '@/assets/icons/acciones/check.svg';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const LightMode: Story = {
  args: {
    label: 'Nombre',
    placeholder: 'Ingresa tu nombre',
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
    label: 'Nombre',
    placeholder: 'Ingresa tu nombre',
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithIconLight: Story = {
  args: {
    label: 'Buscar',
    placeholder: 'Ingresa búsqueda',
    icon: CheckIcon,
  },
  decorators: [
    (Story) => (
      <div data-theme="light" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithIconDark: Story = {
  args: {
    label: 'Buscar',
    placeholder: 'Ingresa búsqueda',
    icon: CheckIcon,
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};
