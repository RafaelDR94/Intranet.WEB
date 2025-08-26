import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext/AuthContext';
import { usePrincipal } from '../context/PrincipalContext/PrincipalContext';
import { vi, describe, beforeEach, it, expect } from 'vitest';

// Mock del formulario dinámico
vi.mock('../components/DynamicForm/DynamicForm', () => ({
  __esModule: true,
  default: ({ fields, onSubmit, children, submitLabel }: any) => {
    const [values, setValues] = React.useState(
      Object.fromEntries(fields.map((f: any) => [f.name, '']))
    );
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(values);
        }}
      >
        {fields.map((f: any) => (
          <input
            key={f.name}
            aria-label={f.label}
            value={values[f.name]}
            onChange={(e) =>
              setValues((v: any) => ({ ...v, [f.name]: e.target.value }))
            }
          />
        ))}
        {children}
        <button type="submit">{submitLabel}</button>
      </form>
    );
  },
}));

// Mocks base
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));
vi.mock('../context/AuthContext/AuthContext', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: vi.fn(),
}));

describe('LoginPage', () => {
  const mockPush = vi.fn();
  const mockLogin = vi.fn();
  const mockHandleRemeberMe = vi.fn();
  const mockSetDarkTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as any).mockReturnValue({ push: mockPush });

    (useAuth as any).mockReturnValue({
      login: mockLogin,
      handleRemeberMe: mockHandleRemeberMe,
      userRemebered: false,
    });

    (usePrincipal as any).mockReturnValue({
      usePrincipalTheme: {
        theme: 'light',
        setDarkTheme: mockSetDarkTheme,
        toggleTheme: vi.fn(),
      },
    });
  });

  it('renderiza el formulario de login', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('activa el modo oscuro si el tema es light', () => {
    render(<LoginPage />);
    expect(mockSetDarkTheme).toHaveBeenCalled();
  });

  it('llama a login y redirige al dashboard si es exitoso', async () => {
    mockLogin.mockResolvedValueOnce({});
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: '123456' });
      expect(mockPush).toHaveBeenCalledWith('/main-page');
    });
  });

  it('muestra alerta si login falla', async () => {
    mockLogin.mockRejectedValueOnce({
      response: {
        data: {
          error_Message: 'Credenciales incorrectas',
        },
      },
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'fail@test.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText(/login incorrecto/i)).toBeInTheDocument();
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    });
  });

  it('marca el toggle "Recordarme" si `userRemebered` es true', () => {
    (useAuth as any).mockReturnValue({
      login: mockLogin,
      handleRemeberMe: mockHandleRemeberMe,
      userRemebered: true,
    });

    render(<LoginPage />);
    const toggle = screen.getByLabelText(/recordarme/i) as HTMLInputElement;
    expect(toggle.checked).toBe(true);
  });

  it('llama a handleRemeberMe al hacer toggle', () => {
    render(<LoginPage />);
    const toggle = screen.getByLabelText(/recordarme/i) as HTMLInputElement;
    fireEvent.click(toggle);
    expect(mockHandleRemeberMe).toHaveBeenCalled();
  });

  it('enlace "¿Olvidaste tu contraseña?" redirige correctamente', () => {
    render(<LoginPage />);
    const link = screen.getByText(/¿olvidaste tu contraseña\?/i);
    expect(link).toHaveAttribute('href', '/login/recover-password');
  });
});
