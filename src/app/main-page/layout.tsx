'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import PersonalAvatar from '../components/PersonalAvatar/PersonalAvatar';
import { ToggleButton } from '../components/ToogleButton.tsx/ToogleButton';
import { usePrincipal } from '../context/PrincipalContext/PrincipalContext';

// ✅ ICONOS SVG COMO COMPONENTES
import LogoDr from '@/assets/images/LogosDR/DReDIT.png';
import HomeIcon from '@/assets/icons/navegacion/home.svg';
import FileIcon from '@/assets/icons/Docs/archive.svg';
import ArrowRightIcon from '@/assets/icons/navegacion/nav-arrow-right.svg';
import ArrowDownIcon from '@/assets/icons/navegacion/nav-arrow-down.svg';
import SubArrowIcon from '@/assets/icons/navegacion/long-arrow-down-right.svg';
import WifiIcon from '@/assets/icons/Connectivity/wifi.svg';
import ThemeIcon from '@/assets/icons/System/System/darkmode.svg';
import HelpIcon from '@/assets/icons/acciones/help-circle.svg';
import LogoutIcon from '@/assets/icons/acciones/open-in-window.svg';
import { useAuth } from '../context/AuthContext/AuthContext';
import { getTabsFromPath } from './utilities/getTabsFromPath';
import { Alert } from '../components/Alert/Alert';
import { useFirebase } from '../context/FirebaseContext/FirebaseContext';
import { PopUp } from '../components/PopUp/PopUp';
import { getShortenedName } from '../utilities/NamesUtilities/NamesUtilities';
import { PermissionAgent } from '../components/PermissionsAgent/PermissionsAgent';
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
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

        {/* Sidebar */}
        <aside className="w-64 bg-blue-90 text-white-10 flex flex-col p-4">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <Image src={LogoDr} alt="DR Security Logo" width={150} height={150} />
          </div>

          {/* Menú lateral */}
          <nav className="flex-1 space-y-2">
            {sidebarRoutes
              .filter(route => {
                // Mostrar rutas sin subrutas si tiene permiso directo
                if (!route.subroutes) return validPermissionsbyroute(route.path);

                // Si tiene subrutas, mostrar solo si alguna subruta es válida
                return route.subroutes.some(sub => validPermissionsbyroute(sub.path));
              })
              .map(route => {
                const Icon = route.icon;

                const isExpanded = expandedSection === route.path;
                const hasSubroutes = route.subroutes && route.subroutes.length > 0;

                return hasSubroutes ? (
                  <div key={route.path}>
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : route.path)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-blue-90 flex justify-between items-center text-s2 font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <Icon />
                        <span>{route.label}</span>
                      </span>
                      {isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
                    </button>

                    {isExpanded && (
                      <div className="ml-6 space-y-1">
                        {route.subroutes
                          .filter(sub => validPermissionsbyroute(sub.path))
                          .map(sub => (
                            <Link
                              key={sub.path}
                              href={sub.path}
                              className="block px-2 py-1 hover:bg-blue-90 rounded text-white-10 text-b3 font-regular"
                            >
                              <div className="flex items-center gap-2">
                                <SubArrowIcon />
                                <span>{sub.label}</span>
                              </div>
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={route.path}
                    href={route.path}
                    className="block px-3 py-2 rounded hover:bg-blue-90 flex items-center gap-2 text-s2 font-semibold"
                  >
                    <Icon />
                    <span>{route.label}</span>
                  </Link>
                );
              })}
          </nav>

          {/* Footer del sidebar */}
          <div className="mt-auto text-sm text-white-10 w-full px-3 py-4">
            {/* Bloque Avatar + Toggles en fila */}
            <div className="flex items-start gap-20">
              {/* Avatar alineado a la izquierda */}
              <PersonalAvatar size="xs" />

              {/* Contenedor de iconos + toggles en columna */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center gap-2">
                  <WifiIcon />
                  <ToggleButton checked={!offlineLoggin} onChange={(checked) => handleOfflineChange(!checked)} label="" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <ThemeIcon />
                    <ToggleButton
                      checked={theme === 'dark'}
                      onChange={toggleTheme}
                      label=""
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* Nombre centrado respecto al bloque completo */}
            <div className="right">
              <p className="font-semibold text-s2 py-2">{getShortenedName(user?.fullName ?? "")}</p>
            </div>

            {/* Links inferior estilo menú */}
            <div className="flex flex-col space-y-1 ">
              <Link
                href="https://drsecurity.atlassian.net/servicedesk/customer/portals"
                className="flex items-center gap-2 text-b3  font-regular hover:bg-blue-90  py-1 rounded"
              >
                <HelpIcon />
                Ayuda
              </Link>
              <button

                className="flex items-center gap-2 text-b3  font-regular hover:bg-blue-90  py-1 rounded"
                onClick={async () => { await logout(); window.location.href = "/" }}
              >
                <LogoutIcon />
                Cerrar Sesión
              </button>
            </div>
          </div>

        </aside>

        {/* Contenido principal + Tabs */}
        <div className="flex-grow ">
          {tabs.filter(tab => validPermissionsbyroute(tab.path)).length > 0 && (
            <>
              <nav className="flex items-center justify-between px-6 pt-8">
                {/* Tabs */}
                <div className="flex items-center text-s1 font-semibold ">
                  {tabs
                    .filter(tab => validPermissionsbyroute(tab.path))
                    .map((tab, index) => {
                      const isActive = pathname.replaceAll("/","") === tab.path.replaceAll("/","");
                      return (
                        <React.Fragment key={tab.path}>
                          {index > 0 && (
                            <div className="h-4 border-l border-gray-20 mx-3" />
                          )}
                          <Link
                            href={tab.path}
                            className={`transition-colors ${isActive ? 'text-gray-100' : 'text-gray-70 hover:text-gray-80'
                              }`}
                          >
                            {tab.label}
                          </Link>
                        </React.Fragment>
                      );
                    })}
                </div>

              </nav>

              {/* Divider horizontal */}
              <div className="h-px bg-gray-20 mt-3 mx-6" />
            </>
          )}


          <main className="p-6 ">{children}</main>
        </div>
      </div>
    </PermissionAgent>
  );
}
