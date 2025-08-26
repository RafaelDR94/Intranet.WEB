import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AuthProvider } from '../context/AuthContext/AuthContext';
import { PrincipalProvider } from '../context/PrincipalContext/PrincipalContext';
import { createMockRouter } from '@/__mocks__/mockRouter';
import useLogin, { loginFields } from './hooks/useLogin';
import { loginStyles } from './styles';
import { DynamicForm } from '../components/DynamicForm/DynamicForm';
import { Alert } from '../components/Alert/Alert';
import { ToggleButton } from '../components/ToogleButton.tsx/ToogleButton';
import Link from 'next/link';
import logo from '@/assets/images/Walpapers/Wallpaper-1.png';

// 🧪 Mock router para Storybook
const mockRouter: any = createMockRouter();

// 🔁 Versión solo para Storybook: renderiza el login con mock router
function LoginPageWithMockRouter() {
  const {
    handleLogin,
    handleRemeber,
    remeberStatus,
    failMessage,
    isLoading,
  } = useLogin(mockRouter); // ✅ override solo aquí

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
                checked={remeberStatus}
                onChange={handleRemeber}
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
        <img
          src={logo.src} // ✅ usa `.src` si estás importando con Webpack
          alt="Fondo DR Security"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
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
