// app/layouts/MainLayoutClient.tsx
"use client";

import React, { ReactNode } from "react";

import MainSidebar from "./components/MainSidebar/MainSidebar";
import MainTabs from "./components/MainTabs/MainTabs";
import MobileSidebar from "./components/MobileSidebar/MobileSidebar";
import useMainPage from "./hooks/useMainPage";
import { mainLayoutStyles } from "./styles";

import { Alert } from "@/app/components/Alert/Alert";
import ErrorBoundary from "@/app/components/ErrorBundary/ErrorBundary";
import LoadingOverlay from "@/app/components/LoadingOverLay/LoadingOverlay";
import { PermissionAgent } from "@/app/components/PermissionsAgent/PermissionsAgent";
import { PopUp } from "@/app/components/PopUp/PopUp";
import ShowImage from "@/app/components/ShowImage/ShowImage";
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
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";

// NEW: Drawer mobile

export default function MainLayoutClient({
  children,
}: {
  readonly children: ReactNode;
}) {
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
    usePrincipalImage,
  } = useMainPage();

  const { usePrincipalLoading } = usePrincipal();
  const { open, message, spinnerSize } = usePrincipalLoading;
  const {
    state: {
      open: imageOpen,
      src,
      alt,
      showAction,
      actionLabel,
      onAction,
      disableOutsideClose,
    },
    hideImage,
  } = usePrincipalImage;

  // NEW: estado del drawer mobile
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Props compartidas para ambos sidebars
  const sidebarSharedProps = {
    offlineMode: offlineLoggin,
    onToggleOffline: handleOfflineChange,
    theme,
    toggleTheme,
    userFullName,
    logout,
    validPermissionsbyroute,
    routes: sidebarRoutes,
  };

  return (
    <ErrorBoundary>

      <PermissionAgent fallbackPath="/main-page/home">
        <div className={mainLayoutStyles.container}>
          {alert && (
            <div className={mainLayoutStyles.alertContainer}>
              <Alert
                {...alert}
                onClose={() => { hideAlert(); }}
                onPrimaryClick={alert.onPrimaryClick ?? hideAlert}
                onSecondaryClick={alert.onSecondaryClick ?? hideAlert}
                variant="subtle"
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

          {/* Drawer Mobile */}
          <MobileSidebar
            isOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
            {...sidebarSharedProps}
          />
          <ShowImage
            open={imageOpen}
            src={src}
            alt={alt}
            showAction={showAction}
            actionLabel={actionLabel}
            onAction={onAction}
            onClose={hideImage} // cerrar desde adentro o afuera
            disableOutsideClose={disableOutsideClose}
          />

          {/* Sidebar fijo solo desktop */}
          <div className="hidden lg:block">
            <MainSidebar {...sidebarSharedProps} />
          </div>

          <div className={mainLayoutStyles.content}>
            <MainTabs
              tabs={tabs}
              pathname={pathname}
              validPermissionsbyroute={validPermissionsbyroute}
              onOpenMobileMenu={() => setMobileOpen(true)} // << abre el drawer
            />
            <main className={mainLayoutStyles.main}>{children}</main>
            <LoadingOverlay
              open={open}
              message={message}
              spinnerSize={spinnerSize}
            />
          </div>
        </div>
      </PermissionAgent>
    </ErrorBoundary>

  );
}
