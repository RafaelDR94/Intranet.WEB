"use client"
// app/layouts/MainLayoutClient.tsx

import React, { ReactNode } from "react";

import MainSidebar from "./components/MainSidebar/MainSidebar";
import MainTabs from "./components/MainTabs/MainTabs";
import MobileSidebar from "./components/MobileSidebar/MobileSidebar";
import Notification from "./components/Notification/Notification";
import useMainPage from "./hooks/useMainPage";
import { mainLayoutStyles } from "./styles";

import { Alert } from "@/app/components/Alert/Alert";
import ErrorBoundary from "@/app/components/ErrorBundary/ErrorBundary";
import LoadingOverlay from "@/app/components/LoadingOverLay/LoadingOverlay";
import { PermissionAgent } from "@/app/components/PermissionsAgent/PermissionsAgent";
import { PopUp } from "@/app/components/PopUp/PopUp";
import ShowImage from "@/app/components/ShowImage/ShowImage";
import { getOfflineModeSuport } from "./utilities/getOfflineModeSuport";
import TutorialProvider from "@/tutorials/engine/TutorialProvider";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";
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
    handleAlertClose,
    sidebarRoutes,
    usePrincipalImage,
    pendingNotifications,
    handleOpenPending,
    handleRemovePending,
  } = useMainPage();

  const { usePrincipalLoading } = usePrincipal();
  const { open, message, spinnerSize } = usePrincipalLoading;
  const {
    state: {
      open: imageOpen,
      src,
      alt,
      items,
      initialIndex,
      showAction,
      actionLabel,
      onAction,
      disableOutsideClose,
    },
    hideImage,
  } = usePrincipalImage;

  // NEW: estado del drawer mobile
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const openMobileSidebar = React.useCallback(() => setMobileOpen(true), []);
  const closeMobileSidebar = React.useCallback(() => setMobileOpen(false), []);
  const hasPendingNotifications = pendingNotifications.length > 0;
  const showNotificationAlert = alert?.type === "notification";
  const hasNotification = hasPendingNotifications || showNotificationAlert;

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


  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.__tutorialSidebar = {
      open: openMobileSidebar,
      close: closeMobileSidebar,
    };
    return () => {
      delete window.__tutorialSidebar;
    };
  }, [openMobileSidebar, closeMobileSidebar]);

  return (
    <ErrorBoundary>
      <TutorialProvider>
        <TutorialAutoRunGate />
        <PermissionAgent fallbackPath="/main-page/home">
          <div className={mainLayoutStyles.container}>
          {alert && (
            <div className={mainLayoutStyles.alertContainer}>
              {showNotificationAlert ? (
                <Notification
                  title={alert.title}
                  description={alert.description}
                  createdAt={alert.createdAt}
                  avatarSrc={alert.avatarSrc}
                  actionLabel={alert.primaryLabel ?? "Ir a evento"}
                  onAction={alert.onPrimaryClick}
                  onClose={handleAlertClose}
                />
              ) : (
                <Alert
                  {...alert}
                  onClose={handleAlertClose}
                  closeOnClick
                  onPrimaryClick={alert.onPrimaryClick ?? handleAlertClose}
                  onSecondaryClick={alert.onSecondaryClick ?? handleAlertClose}
                  variant="subtle"
                />
              )}
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
            onClose={closeMobileSidebar}
            {...sidebarSharedProps}
          />
          <ShowImage
            open={imageOpen}
            src={src}
            alt={alt}
            items={items}
            initialIndex={initialIndex}
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
              hasNotification={hasNotification}
              pendingNotifications={pendingNotifications}
              onOpenPending={handleOpenPending}
              onDismissPending={handleRemovePending}
              onOpenMobileMenu={openMobileSidebar} // << abre el drawer
            />
            <main className={mainLayoutStyles.main} data-tour="main-content">
              {offlineLoggin && !getOfflineModeSuport(pathname)
                ? "El modo offline no tiene soporte en este módulo"
                : children}
            </main>
            <LoadingOverlay
              open={open}
              message={message}
              spinnerSize={spinnerSize}
            />
          </div>
        </div>
        </PermissionAgent>
      </TutorialProvider>
    </ErrorBoundary>
  );
}

const TutorialAutoRunGate = () => {
  useTutorialAutoRun({ moduleId: "main-page", tutorialId: "main-page:theme-toggle" });
  return null;
};
