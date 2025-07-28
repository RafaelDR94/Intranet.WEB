import type { Meta, StoryObj } from '@storybook/react';
import { DynamicForm } from './DynamicForm';
import { FieldModel } from './types';

const meta: Meta<typeof DynamicForm> = {
  title: 'Components/DynamicForm',
  component: DynamicForm,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DynamicForm>;

const fields: FieldModel[] = [
  { type: 'input', name: 'name', label: 'Nombre', value: '', validations: [{ type: 'required' }] },
  { type: 'checkbox', name: 'agree', label: 'Acepto términos', value: false },
];

export const LightMode: Story = {
  args: {
    fields,
    onSubmit: (vals) => console.log(vals),
    title: 'Formulario',
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
    fields,
    onSubmit: (vals) => console.log(vals),
    title: 'Formulario',
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};
