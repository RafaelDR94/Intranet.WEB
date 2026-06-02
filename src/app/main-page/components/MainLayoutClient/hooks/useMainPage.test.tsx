import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/assets/icons/navegacion/home.svg', () => ({ default: 'home' }));
vi.mock('@/assets/icons/Docs/archive.svg', () => ({ default: 'archive' }));

vi.mock('../utilities/getTabsFromPath', () => ({
  getTabsFromPath: () => tabsMock,
}));

const showAlert = vi.fn();
const hideAlert = vi.fn();
const handleOfflineMode = vi.fn();
const logout = vi.fn();
const validPermissionsbyroute = vi.fn();

let firebaseState: { firebaseMessaging: any; permissionsChanged: boolean };
let authUser: { fullName: string; isGerence?: boolean };
let tabsMock: { label: string; path: string }[];

vi.mock('@/app//context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalTheme: { theme: 'light', toggleTheme: vi.fn() },
    usePrincipalAlert: { alert: null, hideAlert, showAlert },
  }),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: authUser,
    offlineMode: false,
    handleOfflineMode,
    logout,
    validPermissionsbyroute,
  }),
}));

vi.mock('@/app/context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: () => firebaseState,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/main-page/home',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

import useMainPage from './useMainPage';

describe('useMainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firebaseState = { firebaseMessaging: null, permissionsChanged: false };
    authUser = { fullName: 'John Doe', isGerence: true };
    tabsMock = [{ label: 'Tab1', path: '/main-page/home/tab1' }];
  });

  it('maneja el cambio offline', () => {
    const { result } = renderHook(() => useMainPage());
    act(() => {
      result.current.handleOfflineChange(true);
    });
    expect(result.current.offlineMeMessage.open).toBe(true);
    expect(result.current.offlineMeMessage.offlineMode).toBe(true);
  });

  it('acepta el cambio offline', () => {
    const { result } = renderHook(() => useMainPage());
    act(() => {
      result.current.handleOfflineChange(true);
    });
    act(() => {
      result.current.handleOkMessageOffline();
    });
    expect(handleOfflineMode).toHaveBeenCalledWith(true);
    expect(result.current.offlineMeMessage.open).toBe(false);
  });

  it('muestra alerta por notificacion', () => {
    firebaseState.firebaseMessaging = { notification: { notification: { title: 't', body: 'b' } } };
    renderHook(() => useMainPage());
    expect(showAlert).toHaveBeenCalled();
  });

  it('oculta el tab de documentos gerenciales cuando el usuario no es gerencia', () => {
    authUser = { fullName: 'John Doe', isGerence: false };
    tabsMock = [
      {
        label: 'Documentos Gerenciales',
        path: '/main-page/request/documents/managementdocuments',
      },
      {
        label: 'Documentos Operativos',
        path: '/main-page/request/documents/operationaldocuments',
      },
    ];

    const { result } = renderHook(() => useMainPage());

    expect(result.current.tabs).toEqual([
      {
        label: 'Documentos Operativos',
        path: '/main-page/request/documents/operationaldocuments',
      },
    ]);
  });


});
