import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingOverlay from './LoadingOverlay';

it('muestra spinner y mensaje cuando open=true', () => {
  render(<LoadingOverlay open message="Enviando..." />);
  expect(screen.getByText('Enviando...')).toBeInTheDocument();
  expect(screen.getByRole('status')).toBeInTheDocument();
});

it('no renderiza cuando open=false', () => {
  const { container } = render(<LoadingOverlay open={false} />);
  expect(container).toBeEmptyDOMElement();
});
