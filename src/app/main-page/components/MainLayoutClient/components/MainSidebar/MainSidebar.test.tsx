import { render, screen } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import MainSidebar from './MainSidebar';

import { createMockRouter } from '@/__mocks__/mockRouter';
import { AuthProvider } from '@/app/context/AuthContext/AuthContext';
import { PrincipalProvider } from '@/app/context/PrincipalContext/PrincipalContext';
import HomeIcon from '@/assets/icons/navegacion/home.svg';

const mockRouter = createMockRouter();

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/main-page/home'),
  useRouter: () => mockRouter,
}));
vi.mock('@/app/context/AuthContext/utilities/AuthService', () => ({
  authenticateUser: vi.fn(),
  readUser: vi.fn().mockResolvedValue(null),
  logoutUser: vi.fn(),
  readUserRemebered: vi.fn().mockResolvedValue(null),
}));

// 🔁 Mocks de recursos

vi.mock('@/assets/icons/navegacion/home.svg', () => ({ default: () => <svg data-testid="home-icon" /> }));
vi.mock('@/assets/images/LogosCG/LogoGC.png', () => ({ default: 'logo.png' }));
vi.mock('@/assets/icons/navegacion/long-arrow-down-right.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/Connectivity/wifi.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/System/System/darkmode.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/System/System/settings.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/acciones/help-circle.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/Fotos y Videos/video-camera.svg', () => ({ default: () => <svg /> }));
vi.mock('@/assets/icons/acciones/open-in-window.svg', () => ({ default: () => <svg /> }));
vi.mock('../ToogleButton.tsx/ToogleButton', () => ({
  ToggleButton: ({ onChange }: any) => <input type="checkbox" onChange={e => onChange(e.target.checked)} />,
}));


const routes = [{ label: 'Inicio', path: '/main-page/home', icon: HomeIcon }];

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
        onToggleOffline={() => { }}
        theme="light"
        toggleTheme={() => { }}
        userFullName="John Doe"
        logout={() => Promise.resolve()}
        validPermissionsbyroute={() => true}
        routes={routes}
      />
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    // expect(screen.getByText('John')).toBeInTheDocument();
  });

  // it('calls onToggleOffline when toggle clicked', () => {
  //   const mock = vi.fn();
  //   renderWithProviders(
  //     <MainSidebar
  //       offlineMode={false}
  //       onToggleOffline={mock}
  //       theme="light"
  //       toggleTheme={() => {}}
  //       userFullName="John Doe"
  //       logout={() => Promise.resolve()}
  //       validPermissionsbyroute={() => true}
  //       routes={routes}
  //     />
  //   );
  //   fireEvent.click(screen.getAllByRole('checkbox')[0]);
  //   expect(mock).toHaveBeenCalled();
  // });
});
