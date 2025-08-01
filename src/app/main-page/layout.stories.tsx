import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import MainLayout from './layout';
import { AuthProvider } from '../context/AuthContext/AuthContext';
import { PrincipalProvider } from '../context/PrincipalContext/PrincipalContext';
import { FirebaseProvider } from '../context/FirebaseContext/FirebaseContext';

function LayoutWithProviders() {
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', '/main-page/home');
  }
  return (
    <PrincipalProvider>
      <AuthProvider>
        <FirebaseProvider>
          <MainLayout>
            <div style={{ padding: '1rem' }}>Contenido de ejemplo</div>
          </MainLayout>
        </FirebaseProvider>
      </AuthProvider>
    </PrincipalProvider>
  );
}

const meta: Meta<typeof LayoutWithProviders> = {
  title: 'Pages/MainLayout',
  component: LayoutWithProviders,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof LayoutWithProviders>;

export const LightMode: Story = {
  render: () => (
    <div data-theme="light" style={{ minHeight: '100vh', background: 'var(--color-gray-10)' }}>
      <LayoutWithProviders />
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" style={{ minHeight: '100vh', background: 'var(--color-gray-10)' }}>
      <LayoutWithProviders />
    </div>
  ),
};
