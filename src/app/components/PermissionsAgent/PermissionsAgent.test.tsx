import { render, screen, act } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { PermissionAgent } from './PermissionsAgent';


const validPermissionsMock = vi.fn();
const pathnameMock = vi.mocked(usePathname);
const routerHook = vi.mocked(useRouter);
const routerReplace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({ replace: vi.fn() })),
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
    // Mockea el router.replace
    routerHook.mockReturnValue({ replace: routerReplace } as any);
    render(
      <PermissionAgent fallbackPath="/home">
        <div>Contenido</div>
      </PermissionAgent>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(routerReplace).toHaveBeenCalledWith('/home');
    vi.useRealTimers();
  });
});

