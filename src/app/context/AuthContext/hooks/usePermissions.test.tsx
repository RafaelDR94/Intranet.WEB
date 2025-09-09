
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import usePermissions from './usePermissions';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

const mockUserWithPermissions :any= {
  treeFirebase: JSON.stringify({
    admin: {
      Acces: true,
      Permissions: {
        view: true,
        edit: true,
      },
    },
    dashboard: {
      Acces: false,
      Permissions: {
        view: false,
      },
    },
  }),
};

describe('usePermissions', () => {
  it('valida permisos correctamente cuando hay acceso', () => {
    const { result } = renderHook(() =>
      usePermissions({ user: mockUserWithPermissions })
    );
    expect(result.current.validPermissionsbyroute('/admin')).toBe(true);
  });

  it('valida permisos correctamente cuando NO hay acceso', () => {
    const { result } = renderHook(() =>
      usePermissions({ user: mockUserWithPermissions })
    );
    expect(result.current.validPermissionsbyroute('/dashboard')).toBe(false);
  });

  it('retorna permisos específicos de una ruta', () => {
    const { result } = renderHook(() =>
      usePermissions({ user: mockUserWithPermissions })
    );
    expect(result.current.getRoutePermissions('/admin')).toEqual({
      view: true,
      edit: true,
    });
  });

  it('retorna objeto vacío si ruta no existe', () => {
    const { result } = renderHook(() =>
      usePermissions({ user: mockUserWithPermissions })
    );
    expect(result.current.getRoutePermissions('/unknown')).toEqual({});
  });

  it('retorna false si user es null', () => {
    const { result } = renderHook(() => usePermissions({ user: null }));
    expect(result.current.validPermissionsbyroute('/admin')).toBe(false);
  });
});
