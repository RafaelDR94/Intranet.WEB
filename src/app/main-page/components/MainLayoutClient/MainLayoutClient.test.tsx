// src/app/main-page/components/MainLayoutClient/MainLayoutClient.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

import MainLayoutClient from './MainLayoutClient'

import { AuthProvider } from '@/app/context/AuthContext/AuthContext'
import { PrincipalProvider } from '@/app/context/PrincipalContext/PrincipalContext'
import { useAuthStore } from '@/app/stores/useAuthStore/useAuthStore'

// ---- Mocks (DEBEN ir antes de importar el componente bajo prueba) ----
vi.mock('@/assets/images/LogosDR/DReDIT.png', () => ({ default: 'logo.png' }))
vi.mock('@/assets/icons/navegacion/home.svg', () => ({ default: () => <svg data-testid="home-icon" /> }))
vi.mock('@/assets/icons/Docs/archive.svg', () => ({ default: () => <svg data-testid="archive-icon" /> }))
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({ default: () => <svg data-testid="arrow-right" /> }))
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg', () => ({ default: () => <svg data-testid="arrow-down" /> }))
vi.mock('@/assets/icons/navegacion/long-arrow-down-right.svg', () => ({ default: () => <svg data-testid="sub-arrow" /> }))
vi.mock('@/assets/icons/Connectivity/wifi.svg', () => ({ default: () => <svg data-testid="wifi" /> }))
vi.mock('@/assets/icons/System/System/darkmode.svg', () => ({ default: () => <svg data-testid="theme" /> }))
vi.mock('@/assets/icons/acciones/help-circle.svg', () => ({ default: () => <svg data-testid="help" /> }))
vi.mock('@/assets/icons/acciones/open-in-window.svg', () => ({ default: () => <svg data-testid="logout" /> }))
vi.mock('@/assets/icons/Comunicacion/bell.svg', () => ({ default: () => <svg data-testid="bell" /> }))
vi.mock('@/assets/icons/acciones/menu.svg', () => ({ default: () => <svg data-testid="menu" /> }))
vi.mock('./components/MainSidebar/MainSidebar', () => ({
  __esModule: true,
  default: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <a>Inicio</a>
        <button onClick={() => setOpen(!open)}>Solicitudes</button>
        {open && <div>Facturación</div>}
      </div>
    );
  },
}))
vi.mock('@/app/components/PersonalAvatar/PersonalAvatar', () => ({ default: () => <div>Avatar</div> }))
vi.mock('@/app/components/ToogleButton/ToogleButton', () => ({ ToggleButton: ({ onChange }: any) => <input type="checkbox" onChange={e => onChange(e.target.checked)} /> }))
vi.mock('@/app/components/Alert/Alert', () => ({ Alert: () => <div>Alert</div> }))
vi.mock('@/app/components/PopUp/PopUp', () => ({ PopUp: () => <div>Popup</div> }))
vi.mock('@/app/components/PermissionsAgent/PermissionsAgent', () => ({
  PermissionAgent: ({ children }: any) => <>{children}</>,
}))

// Mock de Next router (por si algo interno lo usa)
vi.mock('next/navigation', () => ({
  usePathname: () => '/main-page/home',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}))

// Mock de useMainPage (evita que el hook real toque contextos)
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
    usePrincipalImage: {
      state: {
        open: false,
        src: '',
        alt: '',
        showAction: false,
        actionLabel: '',
        onAction: undefined,
        disableOutsideClose: false,
      },
      hideImage: vi.fn(),
    },
  }),
}))

// ---- Importar el SUT DESPUÉS de los mocks ----

// ---- Auth store fake state ----
const mockAuthState = {
  user: {
    token: 'fake-token',
    lifeToken: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    treeFirebase: '{"main-page":{"home":{"Acces":true}}}',
    email: 'john@doe.com',
  } as any,
  token: 'fake-token',
  hasExpired: false,
  remeberMe: false,
  userRemebered: null,
  offlineMode: false,
}

// ---- Helper para envolver con providers requeridos ----
const renderWithProviders = (ui: React.ReactNode) => {
  useAuthStore.setState(mockAuthState as any)
  return render(
    <PrincipalProvider>
      <AuthProvider>{ui}</AuthProvider>
    </PrincipalProvider>
  )
}

describe('MainLayoutClient', () => {
  it('renders sidebar links and children', async () => {
    renderWithProviders(
      <MainLayoutClient>
        <div>Child</div>
      </MainLayoutClient>
    )

    expect(screen.getAllByText('Inicio')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Solicitudes')[0]).toBeInTheDocument()
    expect(screen.getByText('Child')).toBeInTheDocument()
  })

  it('shows subroutes when clicking section', async () => {
    renderWithProviders(
      <MainLayoutClient>
        <div>Child</div>
      </MainLayoutClient>
    )

       const solicitudes = screen.getAllByText('Solicitudes')[0]
    fireEvent.click(solicitudes)

    expect(screen.getByText('Facturación')).toBeInTheDocument();
  });


});
