import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi,beforeAll } from 'vitest';
import MainSidebar from './MainSidebar';
import HomeIcon from '@/assets/icons/navegacion/home.svg';
import { AuthProvider } from '@/app/context/AuthContext/AuthContext';
import { PrincipalProvider } from '@/app/context/PrincipalContext/PrincipalContext';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { createMockRouter } from '@/__mocks__/mockRouter';

// 🔁 Mocks de recursos
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  if (!('indexedDB' in globalThis)) {
    Object.defineProperty(globalThis, 'indexedDB', {
      value: {},
      writable: true,
    });
  }
});
vi.mock('@/assets/icons/navegacion/home.svg', () => ({ default: () => <svg data-testid="home-icon" /> }));
vi.mock('@/assets/images/LogosDR/DReDIT.png', () => ({ default: 'logo.png' }));
vi.mock('@/assets/icons/navegacion/long-arrow-down-right.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/Connectivity/wifi.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/System/System/darkmode.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/acciones/help-circle.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/acciones/open-in-window.svg', () => ({ default: () => <svg /> }));
vi.mock('../ToogleButton.tsx/ToogleButton', () => ({
  ToggleButton: ({ onChange }: any) => <input type="checkbox" onChange={e => onChange(e.target.checked)} />,
}));


const routes = [{ label: 'Inicio', path: '/main-page/home', icon: HomeIcon }];

const mockRouter:any = createMockRouter();

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <RouterContext.Provider value={mockRouter}>
      <PrincipalProvider>
        <AuthProvider>{ui}</AuthProvider>
      </PrincipalProvider>
    </RouterContext.Provider>
  );

describe('MainSidebar', () => {
  it('renders routes and user name', () => {
    renderWithProviders(
      <MainSidebar
        offlineMode={false}
        onToggleOffline={() => {}}
        theme="light"
        toggleTheme={() => {}}
        userFullName="John Doe"
        logout={() => Promise.resolve()}
        validPermissionsbyroute={() => true}
        routes={routes}
      />
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onToggleOffline when toggle clicked', () => {
    const mock = vi.fn();
    renderWithProviders(
      <MainSidebar
        offlineMode={false}
        onToggleOffline={mock}
        theme="light"
        toggleTheme={() => {}}
        userFullName="John Doe"
        logout={() => Promise.resolve()}
        validPermissionsbyroute={() => true}
        routes={routes}
      />
    );
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(mock).toHaveBeenCalled();
  });
});
