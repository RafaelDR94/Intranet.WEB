import { render, screen } from '@testing-library/react';
import React from 'react';

import { ProgressCard } from './ProgressCard';

describe('ProgressCard', () => {
  it('renders title, subtitle and percentage', () => {
    render(<ProgressCard percentage={65} dataTestId="pc" />);
    expect(screen.getByText('Progreso')).toBeInTheDocument();
    expect(screen.getByText('Reporte del progreso del trabajo')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByTestId('pc-donut')).toBeInTheDocument();
  });
});

