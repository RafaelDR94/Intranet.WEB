'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { usePrincipal } from '../context/PrincipalContext/PrincipalContext';

// ✅ ICONOS SVG COMO COMPONENTES
import HomeIcon from '@/assets/icons/navegacion/home.svg';
import FileIcon from '@/assets/icons/Docs/archive.svg';
import { useAuth } from '../context/AuthContext/AuthContext';
import { getTabsFromPath } from './utilities/getTabsFromPath';
import { Alert } from '../components/Alert/Alert';
import { useFirebase } from '../context/FirebaseContext/FirebaseContext';
import { PopUp } from '../components/PopUp/PopUp';
import { PermissionAgent } from '../components/PermissionsAgent/PermissionsAgent';
import MainSidebar from './components/MainSidebar/MainSidebar';
import MainTabs from './components/MainTabs/MainTabs';
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



export default function MainLayout({ children }: { readonly children: React.ReactNode }) {
  const { usePrincipalTheme, usePrincipalAlert } = usePrincipal();
  const { alert, hideAlert, showAlert } = usePrincipalAlert;
  const { theme, toggleTheme } = usePrincipalTheme;
  const pathname = usePathname();
  const tabs = getTabsFromPath(pathname);
  const { user, offlineMode, handleOfflineMode, logout, validPermissionsbyroute } = useAuth();
  const { firebaseMessaging, permissionsChanged } = useFirebase();
  const [offlineLoggin, setofflineLoggin] = useState(offlineMode);
  const [offlineMeMessage, setOfflineMeMessage] = useState({ open: false, offlineMode: offlineMode, messsage: "" });
  const hasRenderedOnce = useRef(false);
  const handleOfflineChange = (
    checked: boolean
  ) => {

    const message1 = "Al activar el modo offline la funcionalidad puede estar limitada y los datos que se mostrarán pueden no ser los mas actuales.";
    const message2 = "Al activar el modo online se trabajara con la información mas actual de la nube.";
    setOfflineMeMessage({ open: true, offlineMode: checked, messsage: checked ? message1 : message2 });
  };

  useEffect(() => {
    setofflineLoggin(offlineMode);
  }, [offlineMode])

  const handleOkMessageOffline = () => {
    handleOfflineMode(offlineMeMessage.offlineMode);
    setOfflineMeMessage({ open: false, offlineMode: false, messsage: "" })
  }

  const handleCancelMessageOffline = () => {
    handleOfflineMode(!offlineMeMessage.offlineMode);
    setOfflineMeMessage({ open: false, offlineMode: false, messsage: "" })
  }

  useEffect(() => {
    if (firebaseMessaging?.notification) {
      showAlert({
        title: firebaseMessaging?.notification?.notification?.title ?? "Notificación",
        description: firebaseMessaging?.notification?.notification?.body ?? "",
        type: 'notification',
        showSecondaryButton: false,
        primaryLabel: "Cerrar"
      })
    }
  }, [firebaseMessaging])

  useEffect(() => {
    if (hasRenderedOnce.current && permissionsChanged) {
      showAlert({
        title: "Los permisos han cambiado",
        description: "Se han modificado tus permisos de acceso",
        type: 'info',
        showSecondaryButton: false,
        primaryLabel: "Cerrar"
      });
    }

    hasRenderedOnce.current = true;
  }, [permissionsChanged]);
  return (
    <PermissionAgent fallbackPath="/main-page/home">
      <div className="min-h-screen flex">
        {/* Alerta flotante */}
        {alert && (
          <div className="fixed top-6 right-6 z-50 w-[400px]">
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
          userFullName={user?.fullName}
          logout={logout}
          validPermissionsbyroute={validPermissionsbyroute}
          routes={sidebarRoutes}
        />

        {/* Contenido principal + Tabs */}
        <div className="flex-grow ">
          <MainTabs tabs={tabs} pathname={pathname} validPermissionsbyroute={validPermissionsbyroute} />
          <main className="p-6 ">{children}</main>
        </div>
      </div>
    </PermissionAgent>
  );
}
