// app/layouts/MainLayoutClient.tsx
'use client';

import { Alert } from '@/app/components/Alert/Alert';
import { PopUp } from '@/app/components/PopUp/PopUp';
import { PermissionAgent } from '@/app/components/PermissionsAgent/PermissionsAgent';
import MainSidebar from './components/MainSidebar/MainSidebar';
import MainTabs from './components/MainTabs/MainTabs';
import { mainLayoutStyles } from './styles';
import useMainPage from './hooks/useMainPage';
import React, { ReactNode } from 'react';



/**
 * Layout principal del sistema DR Intranet.
 *
 * @remarks
 * Este layout se encarga de controlar el tema (claro/oscuro), mostrar alertas, manejar
 * permisos por ruta con `PermissionAgent`, controlar el modo offline, y renderizar el
 * sidebar y las tabs principales.
 *
 * Usa `useMainPage` para centralizar la lógica de navegación, permisos, temas, etc.
 *
 * @param children - Contenido principal de la página
 * @returns Layout completo con `Sidebar`, `Tabs`, `Alerts`, `PopUp`, y children
 */


export default function MainLayoutClient({ children  }: { readonly children: ReactNode }) {
  const {
    alert,
    hideAlert,
    theme,
    toggleTheme,
    pathname,
    tabs,
    userFullName,
    logout,
    validPermissionsbyroute,
    offlineLoggin,
    offlineMeMessage,
    handleOfflineChange,
    handleOkMessageOffline,
    handleCancelMessageOffline,
    sidebarRoutes,
  } = useMainPage();

  return (
    <PermissionAgent fallbackPath="/main-page/home">
      <div className={mainLayoutStyles.container}>
        {alert && (
          <div className={mainLayoutStyles.alertContainer}>
            <Alert
              {...alert}
              onPrimaryClick={alert.onPrimaryClick ?? hideAlert}
              onSecondaryClick={alert.onSecondaryClick ?? hideAlert}
            />
          </div>
        )}

        <PopUp
          open={offlineMeMessage.open}
          onClose={handleCancelMessageOffline}
          title="¿Estás seguro de cambiar el modo?"
          content={offlineMeMessage.messsage}
          showPrimaryButton
          showSecondaryButton
          primaryButtonText="Aceptar"
          secondaryButtonText="Cancelar"
          onPrimaryButtonClick={handleOkMessageOffline}
          onSecondaryButtonClick={handleCancelMessageOffline}
        />

        <MainSidebar
          offlineMode={offlineLoggin}
          onToggleOffline={handleOfflineChange}
          theme={theme}
          toggleTheme={toggleTheme}
          userFullName={userFullName}
          logout={logout}
          validPermissionsbyroute={validPermissionsbyroute}
          routes={sidebarRoutes}
        />

        <div className={mainLayoutStyles.content}>
          <MainTabs tabs={tabs} pathname={pathname} validPermissionsbyroute={validPermissionsbyroute} />
          <main className={mainLayoutStyles.main}>{children}</main>
        </div>
      </div>
    </PermissionAgent>
  );
}
