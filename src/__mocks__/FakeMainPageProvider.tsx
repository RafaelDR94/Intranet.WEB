// src/__storybook__/FakeMainPageProvider.tsx
import React, { createContext, useContext, useState } from 'react';
import HomeIcon from '@/assets/icons/navegacion/home.svg';
import FileIcon from '@/assets/icons/Docs/archive.svg';

const MainPageContext = createContext<any>(null);

export const useMainPage = () => useContext(MainPageContext);

export const FakeMainPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [pathname, setPathname] = useState('/main-page/home');

  const tabs = [
    { label: 'Inicio', path: '/main-page/home' },
    { label: 'Facturación', path: '/main-page/request/invoices' },
  ];

  const sidebarRoutes = [
    {
      label: 'Inicio',
      path: '/main-page/home',
      icon: HomeIcon,
    },
    {
      label: 'Solicitudes',
      path: '/main-page/request',
      icon: FileIcon,
      subroutes: [
        { label: 'Facturación', path: '/main-page/request/invoices' },
      ],
    },
  ];

  const contextValue = {
    alert: null,
    hideAlert: () => {},
    theme: 'light',
    toggleTheme: () => {},
    pathname,
    tabs,
    userFullName: 'John Doe',
    logout: async () => {},
    validPermissionsbyroute: () => true,
    offlineLoggin: false,
    offlineMeMessage: { open: false, offlineMode: false, messsage: '' },
    handleOfflineChange: () => {},
    handleOkMessageOffline: () => {},
    handleCancelMessageOffline: () => {},
    sidebarRoutes,
    // 👉 cambio visual en Storybook al simular navegación
    simulatePathChange: (newPath: string) => setPathname(newPath),
  };

  return <MainPageContext.Provider value={contextValue}>{children}</MainPageContext.Provider>;
};
