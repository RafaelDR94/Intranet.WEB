// src/app/main-page/components/MainLayoutClient/MainLayoutClient.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainLayoutClient from './MainLayoutClient';
import { AuthContext } from '@/app/context/AuthContext/AuthContext';

// Mock de assets e íconos
vi.mock('@/assets/images/LogosDR/DReDIT.png',              () => ({ default: 'logo.png' }));
vi.mock('@/assets/icons/navegacion/home.svg',              () => ({ default: () => <svg data-testid="home-icon" /> }));
vi.mock('@/assets/icons/Docs/archive.svg',                 () => ({ default: () => <svg data-testid="archive-icon" /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg',   () => ({ default: () => <svg data-testid="arrow-right" /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg',    () => ({ default: () => <svg data-testid="arrow-down" /> }));
vi.mock('@/assets/icons/navegacion/long-arrow-down-right.svg', () => ({ default: () => <svg data-testid="sub-arrow" /> }));
vi.mock('@/assets/icons/Connectivity/wifi.svg',            () => ({ default: () => <svg data-testid="wifi" /> }));
vi.mock('@/assets/icons/System/System/darkmode.svg',      () => ({ default: () => <svg data-testid="theme" /> }));
vi.mock('@/assets/icons/acciones/help-circle.svg',         () => ({ default: () => <svg data-testid="help" /> }));
vi.mock('@/assets/icons/acciones/open-in-window.svg',      () => ({ default: () => <svg data-testid="logout" /> }));

// Mock de componentes internos
vi.mock('@/app/components/PersonalAvatar/PersonalAvatar',     () => ({ default: () => <div>Avatar</div> }));
vi.mock('@/app/components/ToogleButton/ToogleButton',        () => ({ ToggleButton: ({ onChange }: any) => <input type="checkbox" onChange={e => onChange(e.target.checked)} /> }));
vi.mock('@/app/components/Alert/Alert',                       () => ({ Alert: () => <div>Alert</div> }));
vi.mock('@/app/components/PopUp/PopUp',                       () => ({ PopUp: () => <div>Popup</div> }));
// <-- Aquí el mock corregido: la ruta real donde lo importa MainLayoutClient
vi.mock('@/app/components/PermissionsAgent/PermissionsAgent', () => ({
  PermissionAgent: ({ children }: any) => <>{children}</>,
}));

// Mock del hook de la página
vi.mock('./hooks/useMainPage', () => ({
  __esModule: true,
  default: () => ({
    alert: null,
    hideAlert: vi.fn(),
    theme: 'light',
    toggleTheme: vi.fn(),
    pathname: '/main-page/home',
    tabs: [{ label: 'Tab1', path: '/main-page/home/tab1' }],
    userFullName: 'John Doe',
    logout: vi.fn(),
    validPermissionsbyroute: () => true,
    offlineLoggin: false,
    offlineMeMessage: { open: false, offlineMode: false, messsage: '' },
    handleOfflineChange: vi.fn(),
    handleOkMessageOffline: vi.fn(),
    handleCancelMessageOffline: vi.fn(),
    sidebarRoutes: [
      { label: 'Inicio', path: '/main-page/home', icon: () => <svg /> },
      {
        label: 'Solicitudes',
        path: '/main-page/request',
        icon: () => <svg />,
        subroutes: [{ label: 'Facturación', path: '/main-page/request/invoices' }],
      },
    ],
  }),
}));

// Mock de tabs
vi.mock('./utilities/getTabsFromPath', () => ({
  getTabsFromPath: () => [{ label: 'Tab1', path: '/main-page/home/tab1' }],
}));

// Mock de Next.js router
vi.mock('next/navigation', () => ({ usePathname: () => '/main-page/home' }));

// Contexto de autenticación simulado
const mockAuthContextValue :any= {
  user: {
    token: 'fake-token',
    lifeToken: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    treeFirebase: '[]',
    email: 'john@doe.com',
  },
  token: 'fake-token',
  hasExpired: false,
  remeberMe: false,
  userRemebered: null,
  offlineMode: false,
  handleForgetUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  verifyOTP: vi.fn(),
  askforOTPemail: vi.fn(),
  validLoggin: vi.fn(),
  validPermissionsbyroute: () => true,
  UpdateUser: vi.fn(),
  setHasExpired: vi.fn(),
  handleRemeberMe: vi.fn(),
  handleOfflineMode: vi.fn(),
  getRoutePermissions: vi.fn(),
  updateUserPermissions: vi.fn(),
};

describe('MainLayoutClient', () => {
  it('renders sidebar links and children', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MainLayoutClient>
          <div>Child</div>
        </MainLayoutClient>
      </AuthContext.Provider>
    );

    // Esperamos a que la UI muestre las rutas
    expect(await screen.findByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Solicitudes')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('shows subroutes when clicking section', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MainLayoutClient>
          <div>Child</div>
        </MainLayoutClient>
      </AuthContext.Provider>
    );

    // Esperamos a que aparezca "Solicitudes" y luego clickeamos
    const solicitudes = await screen.findByText('Solicitudes');
    fireEvent.click(solicitudes);

    expect(screen.getByText('Facturación')).toBeInTheDocument();
  });
});
