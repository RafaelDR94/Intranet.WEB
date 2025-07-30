import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useLogin from './useLogin';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useTheme } from '../../context/ThemeContext/ThemeContext';

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));
vi.mock('../../context/AuthContext/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../../context/ThemeContext/ThemeContext', () => ({ useTheme: vi.fn() }));

describe('useLogin', () => {
  const push = vi.fn();
  const login = vi.fn();
  const handleRemeberMe = vi.fn();
  const setDarkTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as any).mockReturnValue({ push });
    (useAuth as unknown as any).mockReturnValue({ login, handleRemeberMe, userRemebered: false });
    (useTheme as unknown as any).mockReturnValue({ theme: 'light', setDarkTheme });
  });

  it('activa modo oscuro cuando el tema es light', () => {
    renderHook(() => useLogin());
    expect(setDarkTheme).toHaveBeenCalled();
  });

  it('maneja el cambio de remember', () => {
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.handleRemeber(true);
    });
    expect(handleRemeberMe).toHaveBeenCalledWith(true);
    expect(result.current.remeberStatus).toBe(true);
  });

  it('realiza login exitoso', async () => {
    login.mockResolvedValueOnce({});
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({ email: 'test@test.com', password: '123456' });
    });

    expect(login).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/main-page/dashboard');
    expect(result.current.isLoading).toBe(false);
  });

  it('maneja error de login', async () => {
    login.mockRejectedValueOnce({ response: { data: { error_Message: 'error' } } });
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({ email: 'test@test.com', password: '123456' });
    });

    expect(result.current.failMessage).toBe('error');
    expect(result.current.isLoading).toBe(false);
  });
});
