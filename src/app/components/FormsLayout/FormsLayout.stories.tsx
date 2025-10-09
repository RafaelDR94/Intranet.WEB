import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import FormsLayout from './FormsLayout';

const meta: Meta<typeof FormsLayout> = {
  title: 'Components/FormsLayout',
  component: FormsLayout,
  args: {
    title: 'Registra un nuevo recurso',
    primaryLabel: 'Guardar',
    onPrimaryClick: () => undefined,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Cabecera con acciones y tarjetas apiladas para cada children. Ideal para armar formularios con multiples bloques o pasos.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FormsLayout>;

export const Playground: Story = {
  render: (args) => (
    <FormsLayout {...args}>
      <section>
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Datos generales</h3>
        <p style={{ fontSize: 13, color: '#475569' }}>
          Coloca cualquier componente o formulario dentro de este contenedor. Cada children se transforma en una tarjeta.
        </p>
      </section>
      <section>
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Configuracion adicional</h3>
        <ul style={{ fontSize: 13, color: '#475569' }}>
          <li>Soporta boton secundario opcional.</li>
          <li>Respeta layout movil usando el hook useIsMobile.</li>
        </ul>
      </section>
    </FormsLayout>
  ),
};

export const WithSecondaryAction: Story = {
  args: {
    showSecondaryButton: true,
    secondaryLabel: 'Cancelar',
    onSecondaryClick: () => undefined,
  },
  render: (args) => (
    <FormsLayout {...args}>
      <p style={{ fontSize: 13 }}>Puedes mezclar formularios y tablas dentro de cada contenedor.</p>
    </FormsLayout>
  ),
};
