import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useChangePassword from './useChangePassword';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';

global.fetch = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));
vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: vi.fn(),
}));

describe('useChangePassword', () => {
  const push = vi.fn();
  const showAlert = vi.fn();
  const hideAlert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as any).mockReturnValue({ push });
    (useSearchParams as unknown as any).mockReturnValue({
      get: () => 'a@b.com',
    });
    (usePrincipal as unknown as any).mockReturnValue({
      usePrincipalAlert: { showAlert, hideAlert },
    });
  });

  it('valida coincidencia de contraseñas', async () => {
    const { result } = renderHook(() => useChangePassword());
    await act(async () => {
      await result.current.handleChange({
        newPassword: '1',
        confirmPassword: '2',
      });
    });
    expect(showAlert).toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('cambia contraseña correctamente', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true });
    const { result } = renderHook(() => useChangePassword());
    await act(async () => {
      await result.current.handleChange({
        newPassword: '123456',
        confirmPassword: '123456',
      });
    });
    expect(fetch).toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalled();
    const alertArgs = showAlert.mock.calls[0][0];
    alertArgs.onPrimaryClick();
    expect(push).toHaveBeenCalledWith('/login');
  });
});

