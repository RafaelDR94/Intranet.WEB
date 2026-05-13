import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { AuthProvider } from '../context/AuthContext/AuthContext';
import { PrincipalProvider } from '@/app/context/PrincipalContext/PrincipalContext';

import LoginPage from './page';

const meta: Meta<typeof LoginPage> = {
  title: 'Pages/LoginPage',
  component: LoginPage,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof LoginPage>;

const withProviders = (theme: 'light' | 'dark') => (
  <div
    data-theme={theme}
    style={{
      backgroundColor: 'var(--color-gray-10)',
      color: 'var(--color-foreground)',
      minHeight: '100vh',
    }}
  >
    <PrincipalProvider>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </PrincipalProvider>
  </div>
);

export const LightMode: Story = {
  render: () => withProviders('light'),
};

export const DarkMode: Story = {
  render: () => withProviders('dark'),
};
