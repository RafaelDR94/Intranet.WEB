// tests/context/AuthContext.test.tsx
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AuthProvider ,useAuth} from './AuthContext';

import { useAuthStore } from '@/app/stores/useAuthStore/useAuthStore';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));
// Mock de servicios
vi.mock('@/app/context/AuthContext/utilities/AuthService', async () => {
  return {
    authenticateUser: vi.fn().mockResolvedValue(undefined),
    readUser: vi.fn().mockResolvedValue({ user: { userName: 'testuser', token: '123', lifeToken: new Date(Date.now() + 60000).toISOString() } }),
    logoutUser: vi.fn().mockResolvedValue(undefined),
    readUserRemebered: vi.fn().mockResolvedValue(null),
  };
});

// Componente de prueba que consume el contexto
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <p data-testid="user">{auth.user?.userName ?? 'No autenticado'}</p>
      <button onClick={() => auth.login({ email: 'test@test.com', password: 'pass' })}>
        Login
      </button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    useAuthStore.getState().reset()
  });

    it('renderiza usuario no autenticado por defecto', () => {
      // Wrapper necesario para evitar advertencias de React sobre updates fuera de act
      act(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
    });
    expect(screen.getByTestId('user').textContent).toBe('No autenticado');
  });

    it('login actualiza el usuario', async () => {
      // Wrapper necesario para evitar advertencias de React sobre updates fuera de act
      act(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
    });
    userEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('testuser');
    });
  });

    it('logout elimina el usuario', async () => {
      // Wrapper necesario para evitar advertencias de React sobre updates fuera de act
      act(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
    });
    userEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('testuser'));

    userEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('No autenticado'));
  });
});
