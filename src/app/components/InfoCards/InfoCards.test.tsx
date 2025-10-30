import { render, screen } from '@testing-library/react';
import React from 'react';

import { InfoCards } from './InfoCards';

describe('InfoCards component', () => {
  const sample = [
    [
      { label: 'Tipo de reporte', value: 'Correctivo' },
      { label: 'Ticket', value: '5133' },
      { label: 'Categoría', value: 'Accesos' },
    ],
    [
      { label: 'Fecha Inicio', value: '2025/06/02' },
    ],
    [
      { label: 'Ubicación', value: 'Sistema de Transporte Colectivo' },
    ],
  ];

  it('renders cards and items', () => {
    render(<InfoCards cards={sample} dataTestId="ic" />);
    expect(screen.getByTestId('ic')).toBeInTheDocument();
    // Cards
    expect(screen.getByTestId('ic-card-0')).toBeInTheDocument();
    expect(screen.getByTestId('ic-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('ic-card-2')).toBeInTheDocument();
    // Items
    expect(screen.getByText(/Tipo de reporte/)).toBeInTheDocument();
    expect(screen.getByText(/Correctivo/)).toBeInTheDocument();
  });

  it('respects layout matrix creating rows', () => {
    const matrix = [[5, 5], [10]];
    render(<InfoCards cards={sample} layoutMatrix={matrix} dataTestId="ic" />);
    expect(screen.getByTestId('ic-row-0')).toBeInTheDocument();
    expect(screen.getByTestId('ic-row-1')).toBeInTheDocument();
  });
});

