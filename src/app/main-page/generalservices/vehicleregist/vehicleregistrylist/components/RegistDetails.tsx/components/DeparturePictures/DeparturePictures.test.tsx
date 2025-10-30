import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import DeparturePictures from './DeparturePictures';

(globalThis as any).React = React;

const hookReturn = {
  items: [],
  loading: false,
  error: undefined as string | undefined,
  hasAssignment: false,
};

vi.mock('./hooks/useDeparturePictures', () => ({
  __esModule: true,
  default: vi.fn(() => hookReturn),
}));

vi.mock('@/app/components/ActivitiesViewer/ActivitiesViewer', () => ({
  __esModule: true,
  default: ({ items }: any) => (
    <div data-testid="activities-viewer">{items.length}</div>
  ),
}));

describe('DeparturePictures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookReturn.items = [];
    hookReturn.loading = false;
    hookReturn.error = undefined;
    hookReturn.hasAssignment = false;
  });

  it('shows message when no assignment', () => {
    render(<DeparturePictures />);
    expect(
      screen.getByText(/Selecciona un registro/i)
    ).toBeInTheDocument();
  });

  it('shows loading and error messages', () => {
    hookReturn.hasAssignment = true;
    hookReturn.loading = true;
    render(<DeparturePictures />);
    expect(
      screen.getByText(/Cargando fotografias de salida/i)
    ).toBeInTheDocument();

    hookReturn.loading = false;
    hookReturn.error = 'fail';
    render(<DeparturePictures />);
    expect(
      screen.getByText(/No fue posible cargar/i)
    ).toBeInTheDocument();
  });

  it('renders activities viewer when items present', () => {
    hookReturn.hasAssignment = true;
    hookReturn.items = [{ title: 'Front' }];
    render(<DeparturePictures />);
    expect(screen.getByTestId('activities-viewer')).toHaveTextContent('1');
  });
});
