import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import useLogin from './useLogin';

// 🔹 Mock de dependencias externas
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockLogin = vi.fn();

const mockLogout = vi.fn()

vi.mock('../../context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin, logout: mockLogout }), // <--- añade logout
}))

const mockSetDarkTheme = vi.fn();
vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalTheme: { setDarkTheme: mockSetDarkTheme, theme: 'light' },
  }),
}));

// Helpers para mockear localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useLogin hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('carga credenciales recordadas desde localStorage', () => {
    localStorage.setItem('drs.remember.flag', '1');
    localStorage.setItem('drs.remember.email', 'test@drs.com');
    localStorage.setItem('drs.remember.password', '123456');

    const { result } = renderHook(() => useLogin());

    expect(result.current.rememberStatus).toBe(true);
    expect(result.current.loginFields.find(f => f.name === 'email')?.value).toBe('test@drs.com');
    expect(result.current.loginFields.find(f => f.name === 'password')?.value).toBe('123456');
  });

  it('activa el tema oscuro si es light', () => {
    renderHook(() => useLogin());
    expect(mockSetDarkTheme).toHaveBeenCalled();
  });

  it('handleRemember guarda credenciales en localStorage', () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleRemember(true, 'user@drs.com', 'mypassword');
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('drs.remember.email', 'user@drs.com');
    expect(localStorage.setItem).toHaveBeenCalledWith('drs.remember.password', 'mypassword');
  });

  it('login exitoso redirige y guarda credenciales si rememberStatus = true', async () => {
    const pushMock = vi.fn();
    mockLogin.mockResolvedValueOnce({});
    const { result } = renderHook(() => useLogin({ push: pushMock } as any));

    act(() => {
      result.current.handleRemember(true);
    });

    await act(async () => {
      await result.current.handleLogin({ email: 'user@drs.com', password: 'mypassword' });
    });

    expect(mockLogin).toHaveBeenCalledWith({ email: 'user@drs.com', password: 'mypassword' });
    expect(pushMock).toHaveBeenCalledWith('/main-page');
    expect(localStorage.setItem).toHaveBeenCalledWith('drs.remember.email', 'user@drs.com');
  });

  it('login fallido muestra mensaje de error', async () => {
    mockLogin.mockRejectedValueOnce({
      response: { data: { error_Message: 'Credenciales inválidas' } },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({ email: 'wrong@drs.com', password: 'bad' });
    });

    await waitFor(() => {
      expect(result.current.failMessage).toBe('Credenciales inválidas');
    });
  });
});
