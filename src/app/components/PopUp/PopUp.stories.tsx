import type { Meta, StoryObj } from '@storybook/react';
import { PopUp } from './PopUp';
import FormTestPage from '../DynamicForm/FormTestPage';

const meta: Meta<typeof PopUp> = {
  title: 'Components/PopUp',
  component: PopUp,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof PopUp>;

// --- 🎨 Decorator Theme Wrappers ---

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

// --- 🧪 Historias en Light Mode ---

export const BasicoLight: Story = {
  args: {
    title: 'Confirmar acción',
    content: '¿Estás seguro de continuar?',
    showPrimaryButton: true,
    showSecondaryButton: true,
    primaryButtonText: 'Sí',
    secondaryButtonText: 'No',
  },
  decorators: [withLightTheme],
};

export const ConFormularioLight: Story = {
  args: {
    title: 'Enviar mensaje',
    content: 'Por favor completa el formulario:',
    showPrimaryButton: true,
    showSecondaryButton: true,
    primaryButtonText: 'Enviar',
    secondaryButtonText: 'Cancelar',
    children: (
    <FormTestPage/>
    ),
  },
  decorators: [withLightTheme],
};

// --- 🌙 Historias en Dark Mode ---

export const BasicoDark: Story = {
  ...BasicoLight,
  decorators: [withDarkTheme],
};

export const ConFormularioDark: Story = {
  ...ConFormularioLight,
  decorators: [withDarkTheme],
};
