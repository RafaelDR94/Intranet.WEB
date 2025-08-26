// tests/context/AuthContext.test.tsx
import React from 'react';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { AuthProvider ,useAuth} from './AuthContext';
import userEvent from '@testing-library/user-event';
vi.unmock('@/app/context/AuthContext/AuthContext');
// Mock de servicios
vi.mock('@/app/context/AuthContext/utilities/AuthService', async () => {
  return {
    authenticateUser: vi.fn().mockResolvedValue(undefined),
    readUser: vi.fn().mockResolvedValue({ user: { userName: 'testuser', token: '123' } }),
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
  });

  it('renderiza usuario no autenticado por defecto', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user').textContent).toBe('No autenticado');
  });

  it('login actualiza el usuario', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    userEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('testuser');
    });
  });

  it('logout elimina el usuario', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    userEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('testuser'));

    userEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('No autenticado'));
  });
});
