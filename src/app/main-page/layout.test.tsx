import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainLayout from './layout';

vi.mock('@/assets/images/LogosDR/DReDIT.png', () => ({ default: 'logo.png' }));
vi.mock('@/assets/icons/navegacion/home.svg', () => ({ default: () => <svg data-testid="home-icon" /> }));
vi.mock('@/assets/icons/Docs/archive.svg', () => ({ default: () => <svg data-testid="archive-icon" /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({ default: () => <svg data-testid="arrow-right" /> }));
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg', () => ({ default: () => <svg data-testid="arrow-down" /> }));
vi.mock('@/assets/icons/navegacion/long-arrow-down-right.svg', () => ({ default: () => <svg data-testid="sub-arrow" /> }));
vi.mock('@/assets/icons/Connectivity/wifi.svg', () => ({ default: () => <svg data-testid="wifi" /> }));
vi.mock('@/assets/icons/System/System/darkmode.svg', () => ({ default: () => <svg data-testid="theme" /> }));
vi.mock('@/assets/icons/acciones/help-circle.svg', () => ({ default: () => <svg data-testid="help" /> }));
vi.mock('@/assets/icons/acciones/open-in-window.svg', () => ({ default: () => <svg data-testid="logout" /> }));

vi.mock('../components/PersonalAvatar/PersonalAvatar', () => ({ default: () => <div>Avatar</div> }));
vi.mock('../components/ToogleButton.tsx/ToogleButton', () => ({ ToggleButton: ({ onChange }: any) => <input type="checkbox" onChange={(e) => onChange(e.target.checked)} /> }));
vi.mock('../components/Alert/Alert', () => ({ Alert: () => <div>Alert</div> }));
vi.mock('../components/PopUp/PopUp', () => ({ PopUp: () => <div>Popup</div> }));
vi.mock('../components/PermissionsAgent/PermissionsAgent', () => ({ PermissionAgent: ({ children }: any) => <>{children}</> }));

vi.mock('../context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: { fullName: 'John Doe' },
    offlineMode: false,
    handleOfflineMode: vi.fn(),
    logout: vi.fn(),
    validPermissionsbyroute: () => true,
  }),
}));
vi.mock('../context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalTheme: { theme: 'light', toggleTheme: vi.fn() },
    usePrincipalAlert: { alert: null, hideAlert: vi.fn(), showAlert: vi.fn() },
  }),
}));
vi.mock('../context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: () => ({ firebaseMessaging: null, permissionsChanged: false }),
}));

vi.mock('./utilities/getTabsFromPath', () => ({
  getTabsFromPath: () => [{ label: 'Tab1', path: '/main-page/home/tab1' }],
}));

vi.mock('next/navigation', () => ({ usePathname: () => '/main-page/home' }));

describe('MainLayout', () => {
  it('renders sidebar links and children', () => {
    render(
      <MainLayout>
        <div>Child</div>
      </MainLayout>
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Solicitudes')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('shows subroutes when clicking section', () => {
    render(
      <MainLayout>
        <div>Child</div>
      </MainLayout>
    );
    const requestButton = screen.getByText('Solicitudes');
    fireEvent.click(requestButton);
    expect(screen.getByText('Facturación')).toBeInTheDocument();
  });
});
