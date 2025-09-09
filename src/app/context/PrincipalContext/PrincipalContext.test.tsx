import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { PrincipalProvider, usePrincipal } from './PrincipalContext';

describe('PrincipalContext', () => {
  it('provides hooks to children', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PrincipalProvider>{children}</PrincipalProvider>
    );

    const { result } = renderHook(() => usePrincipal(), { wrapper });

    expect(result.current.usePrincipalTheme).toBeDefined();
    expect(result.current.usePrincipalAlert).toBeDefined();
    expect(result.current.usePrincipalLoading).toBeDefined(); // nuevo
    expect(typeof result.current.usePrincipalLoading.showSpinner).toBe('function');
    expect(typeof result.current.usePrincipalLoading.hideSpinner).toBe('function');
    expect(typeof result.current.usePrincipalLoading.withLoading).toBe('function');
  });

  it('controls LoadingOverlay state with show/hide', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PrincipalProvider>{children}</PrincipalProvider>
    );

    const { result } = renderHook(() => usePrincipal(), { wrapper });

    act(() => {
      result.current.usePrincipalLoading.showSpinner({ message: 'Probando…' });
    });
    expect(result.current.usePrincipalLoading.open).toBe(true);
    expect(result.current.usePrincipalLoading.message).toBe('Probando…');

    act(() => {
      result.current.usePrincipalLoading.hideSpinner();
    });
    expect(result.current.usePrincipalLoading.open).toBe(false);
  });

  it('withLoading opens and closes automatically', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PrincipalProvider>{children}</PrincipalProvider>
    );

    const { result } = renderHook(() => usePrincipal(), { wrapper });

    await act(async () => {
      const value = await result.current.usePrincipalLoading.withLoading(async () => 42, {
        message: 'Cargando…',
      });
      expect(value).toBe(42);
    });

    expect(result.current.usePrincipalLoading.open).toBe(false);
  });

  it('throws error outside provider', () => {
    expect(() => renderHook(() => usePrincipal())).toThrow();
  });
});
