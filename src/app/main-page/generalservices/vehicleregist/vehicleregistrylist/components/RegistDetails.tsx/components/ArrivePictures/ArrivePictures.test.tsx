import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ArrivePictures from './ArrivePictures';

(globalThis as any).React = React;

const hookReturn = {
  items: [],
  loading: false,
  error: undefined as string | undefined,
  hasAssignment: false,
};

vi.mock('./hooks/useArrivePictures', () => ({
  __esModule: true,
  default: vi.fn(() => hookReturn),
}));

vi.mock('@/app/components/ActivitiesViewer/ActivitiesViewer', () => ({
  __esModule: true,
  default: ({ items }: any) => (
    <div data-testid='activities-viewer'>{items.length}</div>
  ),
}));

describe('ArrivePictures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookReturn.items = [];
    hookReturn.loading = false;
    hookReturn.error = undefined;
    hookReturn.hasAssignment = false;
  });

  it('returns placeholder when no assignment', () => {
    render(<ArrivePictures />);
    expect(
      screen.getByText(/Selecciona un registro/i)
    ).toBeInTheDocument();
  });

  it('renders statuses correctly', () => {
    hookReturn.hasAssignment = true;
    hookReturn.loading = true;
    render(<ArrivePictures />);
    expect(
      screen.getByText(/Cargando fotografias de llegada/i)
    ).toBeInTheDocument();

    hookReturn.loading = false;
    hookReturn.error = 'error';
    render(<ArrivePictures />);
    expect(
      screen.getByText(/No fue posible cargar/i)
    ).toBeInTheDocument();
  });

  it('renders viewer when items exist', () => {
    hookReturn.hasAssignment = true;
    hookReturn.items = [{ title: 'Front' }];
    render(<ArrivePictures />);
    expect(screen.getByTestId('activities-viewer')).toHaveTextContent('1');
  });
});
