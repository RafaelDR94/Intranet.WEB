import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { PermissionRedirect } from './PermissionRedirect';

describe('PermissionRedirect', () => {
  it('redirects to first allowed route', async () => {
    const replace = vi.fn();
    const checker = vi.fn((path) => path === '/b');
    render(
      <PermissionRedirect
        routes={['/a', '/b']}
        permissionChecker={checker}
        router={{ replace, push: vi.fn() }}
      />
    );
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/b');
    });
  });

  it('shows message and sends to home when no routes allowed', async () => {
    const push = vi.fn();
    render(
      <PermissionRedirect
        routes={['/a']}
        permissionChecker={() => false}
        router={{ replace: vi.fn(), push }}
        homePath="/home"
      />
    );
    await waitFor(() => {
      expect(
        screen.getByText('No tienes permisos para esta sección.')
      ).toBeInTheDocument();
    });
    screen.getByRole('button', { name: 'Ir al inicio' }).click();
    expect(push).toHaveBeenCalledWith('/home');
  });
});
