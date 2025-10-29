import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Signatures from './Signatures';

(globalThis as any).React = React;

const hookReturn = {
  loading: false,
  error: undefined as string | undefined,
  hasAssignment: false,
  signatureUrl: undefined as string | undefined,
  driverName: undefined as string | undefined,
  arrivalDateLabel: undefined as string | undefined,
};

vi.mock('./hooks/useSignatures', () => ({
  __esModule: true,
  default: vi.fn(() => hookReturn),
}));

vi.mock('@/app/components/SignatureBox/SignatureBox', () => ({
  __esModule: true,
  default: ({ title }: any) => <div data-testid='signature-box'>{title}</div>,
}));

describe('Signatures component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookReturn.loading = false;
    hookReturn.error = undefined;
    hookReturn.hasAssignment = false;
    hookReturn.signatureUrl = undefined;
  });

  it('shows placeholder when assignment missing', () => {
    render(<Signatures />);
    expect(
      screen.getByText(/Selecciona un registro/i)
    ).toBeInTheDocument();
  });

  it('renders loading and error states', () => {
    hookReturn.hasAssignment = true;
    hookReturn.loading = true;
    render(<Signatures />);
    expect(screen.getByText(/Cargando firma/i)).toBeInTheDocument();

    hookReturn.loading = false;
    hookReturn.error = 'fallo';
    render(<Signatures />);
    expect(screen.getByText(/No fue posible cargar/i)).toBeInTheDocument();
  });

  it('renders signature box when url present', () => {
    hookReturn.hasAssignment = true;
    hookReturn.signatureUrl = 'https://example/signature.png';
    hookReturn.driverName = 'Alice';
    render(<Signatures />);
    expect(screen.getByTestId('signature-box')).toHaveTextContent('Alice');
  });
});
