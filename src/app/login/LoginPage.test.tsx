// LoginPage.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// --- Mocks base --- //
vi.mock('next/link', () => {
  return {
    default: ({ href, children, ...rest }: any) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

vi.mock('next/image', () => {
  // Componente <img> simple para probar presencia por alt
  return {
    default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
  };
});

// Mock de estilos (clases sencillas)
vi.mock('./styles', () => {
  return {
    loginStyles: {
      page: 'page',
      formContainer: 'formContainer',
      formWrapper: 'formWrapper',
      rememberContainer: 'rememberContainer',
      logoContainer: 'logoContainer',
      logo: 'logo',
    },
  };
});

// Mock de imágenes estáticas
vi.mock('@/assets/images/Walpapers/Wallpaper-1.png', () => ({ default: '/wallpaper-desktop.png' }));
vi.mock('@/assets/images/Walpapers/wallpaper-mobile.png', () => ({ default: '/wallpaper-mobile.png' }));

// Mock de hijos usados por LoginPage
vi.mock('../components/DynamicForm/DynamicForm', () => {
  return {
    default: ({ onSubmit, submitLabel, loading, children }: any) => (
      <form
        aria-label="dynamic-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
      >
        {children}
        <button type="submit" disabled={!!loading}>
          {submitLabel ?? 'Enviar'}
        </button>
      </form>
    ),
  };
});

vi.mock('../components/Alert/Alert', () => {
  return {
    Alert: ({ title, description }: any) => (
      <div role="alert">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    ),
  };
});

vi.mock('../components/ToogleButton/ToogleButton', () => {
  // Botón que llama onChange(!checked) al click
  return {
    ToggleButton: ({ checked, onChange, label, ...rest }: any) => (
      <button
        type="button"
        aria-pressed={!!checked}
        aria-label={label ?? 'toggle'}
        onClick={() => onChange?.(!checked)}
        {...rest}
      >
        {label ?? 'toggle'}
      </button>
    ),
  };
});

// --- Mock del hook useLogin con estado configurable --- //
type LoginMockState = {
  handleLogin: () => void;
  handleRemember: (checked: boolean) => void;
  rememberStatus: boolean;
  failMessage: string | null;
  isLoading: boolean;
  loginFields: any[];
};

const loginState: LoginMockState = {
  handleLogin: vi.fn(),
  handleRemember: vi.fn(),
  rememberStatus: false,
  failMessage: null,
  isLoading: false,
  loginFields: [
    { id: 'email', type: 'email', label: 'Email', value: '' },
    { id: 'password', type: 'password', label: 'Password', value: '' },
  ],
};

export function __setLoginMock(partial: Partial<LoginMockState>) {
  Object.assign(loginState, partial);
}
export function __resetLoginMock() {
  loginState.handleLogin = vi.fn();
  loginState.handleRemember = vi.fn();
  loginState.rememberStatus = false;
  loginState.failMessage = null;
  loginState.isLoading = false;
}

vi.mock('./hooks/useLogin', () => {
  return {
    default: () => ({ ...loginState }),
  };
});

// Importar el componente después de definir mocks
import LoginPage from './page'; // ajusta la ruta si tu archivo no se llama page.tsx

describe('LoginPage', () => {
  beforeEach(() => {
    __resetLoginMock();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renderiza el formulario, el botón de enviar y el enlace de recuperar contraseña', () => {
    render(<LoginPage />);

    expect(screen.getByRole('form', { name: 'dynamic-form' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument();

    const recover = screen.getByRole('link', { name: /¿Olvidaste tu contraseña\?/i });
    expect(recover).toBeInTheDocument();
    expect(recover).toHaveAttribute('href', '/login/recover-password');
  });

  it('propaga el submit al handleLogin del hook', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    __setLoginMock({ handleLogin: spy });

    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('llama a handleRemember con el valor alternado al hacer click en ToggleButton', async () => {
    const user = userEvent.setup();
    const rememberSpy = vi.fn();
    __setLoginMock({ rememberStatus: false, handleRemember: rememberSpy });

    render(<LoginPage />);

    const toggle = screen.getByRole('button', { name: /Recordarme/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);
    // Debe enviar el opuesto a rememberStatus (false -> true)
    expect(rememberSpy).toHaveBeenCalledWith(true);
  });

  it('muestra el Alert cuando existe failMessage', () => {
    __setLoginMock({ failMessage: 'Credenciales inválidas' });

    render(<LoginPage />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Login incorrecto')).toBeInTheDocument();
    expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
  });

  it('no muestra el Alert cuando failMessage es null/undefined', () => {
    __setLoginMock({ failMessage: null });

    render(<LoginPage />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('deshabilita el botón de submit cuando isLoading es true', async () => {
    __setLoginMock({ isLoading: true });

    render(<LoginPage />);
    const submit = screen.getByRole('button', { name: 'Iniciar sesión' });
    expect(submit).toBeDisabled();
  });

  it('renderiza las imágenes de fondo (desktop y mobile) con sus alt texts', () => {
    render(<LoginPage />);
    expect(screen.getByAltText('Fondo DR Security (desktop)')).toBeInTheDocument();
    expect(screen.getByAltText('Fondo DR Security (mobile)')).toBeInTheDocument();
  });
});
