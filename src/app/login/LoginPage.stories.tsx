import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import LoginPage from './page';
import { AuthProvider } from '../context/AuthContext/AuthContext';
import { ThemeProvider } from '../context/ThemeContext/ThemeContext';
import { createMockRouter } from '@/__mocks__/mockRouter';

const mockRouter :any = createMockRouter();

// ✅ Componente temporal que inyecta el router al hook
function LoginPageWithMock() {
  return <LoginPage routerOverride={mockRouter} />;
}

const meta: Meta<typeof LoginPage> = {
  title: 'Pages/LoginPage',
  component: LoginPage,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof LoginPage>;

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
    <ThemeProvider>
      <AuthProvider>
        <Component />
      </AuthProvider>
    </ThemeProvider>
  </div>
);

export const LightMode: Story = {
  render: () => withProviders(LoginPageWithMock, 'light'),
};

export const DarkMode: Story = {
  render: () => withProviders(LoginPageWithMock, 'dark'),
};
