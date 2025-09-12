import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { InfoCards } from './InfoCards';

const meta: Meta<typeof InfoCards> = {
  title: 'Components/InfoCards',
  component: InfoCards,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof InfoCards>;

const sample = [
  [
    { label: 'Tipo de reporte', value: 'Correctivo' },
    { label: 'Ticket', value: '5133' },
    { label: 'Categoría', value: 'Accesos' },
  ],
  [
    { label: 'Fecha Inicio', value: '2025/06/02' },
    { label: 'Fecha Final', value: '2025/06/02' },
  ],
  [
    { label: 'Ubicación', value: 'Sistema de Transporte Colectivo' },
  ],
  [
    { label: 'Observaciones', value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
  ],
  [
    { label: 'Diagnóstico', value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
  ],
  [
    { label: 'Solución', value: 'Se realiza revisión de pasillo hidden gate en E1 de óptima 1, se revisan fusibles, se realiza una descarga desde axion, se ajustan conexiones de las tarjetas, limpié y revisión de fotocel...' },
  ],
];

export const Default: Story = {
  render: () => (
    <div style={{ padding: '1rem' }}>
      <InfoCards
        cards={sample}
        responsiveLayoutMatrix={{ sm: [[10], [10], [10], [10], [10], [10]], md: [[5, 5], [10], [10], [10], [10], [10]] }}
      />
    </div>
  ),
};

