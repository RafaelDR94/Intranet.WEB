import type { Meta, StoryObj } from '@storybook/react';
import Link from 'next/link';
import React from 'react';

// ✅ Providers (ajusta las rutas si tu estructura difiere)

// ✅ Hook y utilidades

// ✅ Componentes UI usados en la página
import { Alert } from '../components/Alert/Alert';
import { DynamicForm } from '../components/DynamicForm/DynamicForm';
import { ToggleButton } from '../components/ToogleButton/ToogleButton';
import { AuthProvider } from '../context/AuthContext/AuthContext';
import useLogin from './hooks/useLogin';

// ✅ Estilos y assets
import { loginStyles } from './styles';

import { createMockRouter } from '@/__mocks__/mockRouter';
import { PrincipalProvider } from '@/app/context/PrincipalContext/PrincipalContext';
import logo from '@/assets/images/Walpapers/Wallpaper-1.png';

// 🧪 Mock router para Storybook
const mockRouter: any = createMockRouter();

// 🔁 Versión para Storybook que usa el mock router y providers
function LoginPageWithMockRouter() {
  const {
    handleLogin,
    handleRemember,
    rememberStatus,
    failMessage,
    isLoading,
    loginFields,
  } = useLogin(mockRouter); // ✅ override del router solo en Storybook

  return (
    <div className={loginStyles.page}>
      {/* Columna izquierda - Formulario */}
      <div className={loginStyles.formContainer}>
        <div className={loginStyles.formWrapper}>
          <DynamicForm
            fields={loginFields}
            onSubmit={handleLogin}
            submitLabel="Iniciar sesión"
            loading={isLoading}
          >
            <div className={loginStyles.rememberContainer}>
              <ToggleButton
                checked={rememberStatus}
                onChange={(checked: boolean) => handleRemember(checked)}
                label="Recordarme"
                labelColor="text-black-100"
              />
              <Link href="/login/recover-password" className="text-label hover:text-black-100">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            {failMessage && (
              <Alert
                type="error"
                variant="subtle"
                title="Login incorrecto"
                description={failMessage}
                showPrimaryButton={false}
                showSecondaryButton={false}
              />
            )}
          </DynamicForm>
        </div>
      </div>

      {/* Columna derecha - Logo */}
      <div className={loginStyles.logoContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.src}
          alt="Fondo DR Security"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          className={loginStyles.logo}
        />
      </div>
    </div>
  );
}

// 📚 Configuración de Storybook
const meta: Meta<typeof LoginPageWithMockRouter> = {
  title: 'Pages/LoginPage',
  component: LoginPageWithMockRouter,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof LoginPageWithMockRouter>;

// 🧩 Proveedor de contexto + tema
const withProviders = (Component: React.FC, theme: 'light' | 'dark') => (
  <div
    data-theme={theme}
    style={{
      backgroundColor: 'var(--color-gray-10)',
      color: 'var(--color-foreground)',
      minHeight: '100vh',
      padding: '1rem',
    }}
  >
    <PrincipalProvider>
      <AuthProvider>
        <Component />
      </AuthProvider>
    </PrincipalProvider>
  </div>
);

// 🌞 Modo claro
export const LightMode: Story = {
  render: () => withProviders(LoginPageWithMockRouter, 'light'),
};

// 🌙 Modo oscuro
export const DarkMode: Story = {
  render: () => withProviders(LoginPageWithMockRouter, 'dark'),
};
/* eslint-disable @next/next/no-img-element */
