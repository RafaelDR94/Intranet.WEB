import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PermissionAgent } from './PermissionsAgent';

import { usePathname, redirect } from 'next/navigation';

const validPermissionsMock = vi.fn();
const pathnameMock = vi.mocked(usePathname);
const redirectMock = vi.mocked(redirect);

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: {
      showAlert: vi.fn(),
    },
  }),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    validPermissionsbyroute: validPermissionsMock,
    user: { treeFirebase: {} },
  }),
}));


describe('PermissionAgent', () => {
  it('renders children when permission is granted', () => {
    vi.useFakeTimers();
    validPermissionsMock.mockReturnValue(true);
    pathnameMock.mockReturnValue('/protected');
    render(
      <PermissionAgent>
        <div>Contenido</div>
      </PermissionAgent>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByText('Contenido')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('shows fallback message on home path when no permission', () => {
    vi.useFakeTimers();
    validPermissionsMock.mockReturnValue(false);
    pathnameMock.mockReturnValue('main-page/home');
    render(
      <PermissionAgent>
        <div>Contenido</div>
      </PermissionAgent>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(
      screen.getByText('No tienes permisos para acceder a esta sección.')
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('calls redirect when no permission on other paths', () => {
    vi.useFakeTimers();
    validPermissionsMock.mockReturnValue(false);
    pathnameMock.mockReturnValue('/other');
    render(
      <PermissionAgent fallbackPath="/home">
        <div>Contenido</div>
      </PermissionAgent>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(redirectMock).toHaveBeenCalledWith('/home');
    vi.useRealTimers();
  });
});

