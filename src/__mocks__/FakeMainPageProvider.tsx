// src/__storybook__/FakeMainPageProvider.tsx
import React, { createContext, useContext, useState } from 'react';

import FileIcon from '@/assets/icons/Docs/archive.svg';
import HomeIcon from '@/assets/icons/navegacion/home.svg';

const MainPageContext = createContext<any>(null);

export const useMainPage = () => useContext(MainPageContext);

export const FakeMainPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [pathname, setPathname] = useState('/main-page/home');

  const tabs = [
    { label: 'Inicio', path: '/main-page/home' },
    { label: 'Historico de facturas', path: '/main-page/accounting/documentshistory' },
  ];

  const sidebarRoutes = [
    {
      label: 'Inicio',
      path: '/main-page/home',
      icon: HomeIcon,
    },
    {
      label: 'Operaciones',
      path: '/main-page/operations',
      icon: FileIcon,
      subroutes: [
        { label: 'Historico de facturas', path: '/main-page/operations/documentshistory' },
      ],
    },
    {
      label: 'Contabilidad',
      path: '/main-page/accounting',
      icon: FileIcon,
      subroutes: [
        { label: 'Historico de facturas', path: '/main-page/accounting/documentshistory' },
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
    // ðŸ‘‰ cambio visual en Storybook al simular navegaciÃ³n
    simulatePathChange: (newPath: string) => setPathname(newPath),
  };

  return <MainPageContext.Provider value={contextValue}>{children}</MainPageContext.Provider>;
};

