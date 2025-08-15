import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useRecoverPassword from './useRecoverPassword';
import { useRouter } from 'next/navigation';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';

global.fetch = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));
vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({ usePrincipal: vi.fn() }));

describe('useRecoverPassword', () => {
  const push = vi.fn();
  const showAlert = vi.fn();
  const hideAlert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as any).mockReturnValue({ push });
    (usePrincipal as unknown as any).mockReturnValue({
      usePrincipalAlert: { showAlert, hideAlert },
    });
  });

  it('envía correo y redirige', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true });
    const { result } = renderHook(() => useRecoverPassword());

    await act(async () => {
      await result.current.handleRecover({ email: 'a@b.com' });
    });

    expect(fetch).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith(
      '/login/recover-password/recovery-email?email=a%40b.com'
    );
  });

  it('muestra alerta en error', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: false });
    const { result } = renderHook(() => useRecoverPassword());

    await act(async () => {
      await result.current.handleRecover({ email: 'a@b.com' });
    });

    expect(showAlert).toHaveBeenCalled();
  });
});

