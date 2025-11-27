import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';

import { useAuth } from '../../../../context/AuthContext/AuthContext';
import { useFirebase } from '../../../../context/FirebaseContext/FirebaseContext';
import { usePrincipal } from '../../../../context/PrincipalContext/PrincipalContext';
import { getTabsFromPath } from '../utilities/getTabsFromPath';
import { OfflineMessage } from './types';

import ServerIcon from '@/assets/icons/Connectivity/server.svg';
import FileIcon from '@/assets/icons/Docs/archive.svg';
import HomeIcon from '@/assets/icons/navegacion/home.svg';
/**
 * Rutas visibles en el sidebar principal de la página /main-page.
 */
export const sidebarRoutes = [
  {
    label: 'Inicio',
    path: '/main-page/home',
    icon: HomeIcon,
  },
  {
    label: 'Tesorería',
    path: '/main-page/treasury',
    icon: ServerIcon,
    subroutes: [
      { label: 'Caja Chica', path: '/main-page/treasury/treasurypettycash' },
    ],
  },
  {
    label: 'Solicitudes',
    path: '/main-page/request',
    icon: FileIcon,
    subroutes: [
      { label: 'Caja Chica', path: '/main-page/request/pettycash' },
      { label: 'Documentos', path: '/main-page/request/documents' },
      { label: 'Facturación', path: '/main-page/request/invoices' },
      { label: 'Accesos', path: '/main-page/request/acces' }
    ],
  },
  {
    label: 'Contabilidad',
    path: '/main-page/accounting',
    icon: ServerIcon,
    subroutes: [
      { label: 'Facturación', path: '/main-page/accounting/invoices' },
      { label: 'Facturación personal', path: '/main-page/accounting/personalInvoices' },
      { label: 'Requisiciones', path: '/main-page/accounting/requisitions' },
      { label: 'SAP', path: '/main-page/accounting/sap' },
    ],
  },
  {
    label: 'Reportes',
    path: '/main-page/sip',
    icon: ServerIcon,
    subroutes: [
      { label: 'Proyectos', path: '/main-page/sip/proyects' },
    ],
  },
  {
    label: 'Servicios Generales',
    path: '/main-page/generalservices',
    icon: ServerIcon,
    subroutes: [
      { label: 'Registro Vehicular', path: '/main-page/generalservices/vehicleregist' },
    ],
  },
  {
    label: 'RH',
    path: '/main-page/humanresources',
    icon: ServerIcon,
    subroutes: [
      { label: 'Comunicados', path: '/main-page/humanresources/release' },
      { label: 'Documentos', path: '/main-page/humanresources/documents' },
    ],
  },
  {
    label: 'Administración',
    path: '/main-page/usersmanagment',
    icon: ServerIcon,
    subroutes: [
      { label: 'Administracion de usuarios', path: '/main-page/administration/usersmanagment' },
    ],
  },
];

/**
 * Estado del mensaje modal de confirmación para activar/desactivar el modo offline.
 */


/**
 * Hook principal para manejar lógica y estado de la página `MainPage`.
 * Incluye control de tema, alertas, notificaciones, tabs, logout, permisos y modo offline.
 *
 * @returns {object} props y funciones listas para usar en el layout y sidebar principal.
 */
export const useMainPage = () => {
  // Hooks de contexto global
  const { usePrincipalTheme, usePrincipalAlert, usePrincipalImage } = usePrincipal();
  const { alert, hideAlert, showAlert } = usePrincipalAlert;
  const { theme, toggleTheme } = usePrincipalTheme;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleAlertClose = useCallback(() => {
    alert?.onClose?.();
    hideAlert();
  }, [alert, hideAlert]);

  const tabs = useMemo(
    () => getTabsFromPath(pathname, searchParams),
    [pathname, searchParams]
  );

  const { user, offlineMode, handleOfflineMode, logout, validPermissionsbyroute } = useAuth();
  const { firebaseMessaging } = useFirebase();

  const [offlineLoggin, setOfflineLoggin] = useState(offlineMode);

  const [offlineMeMessage, setOfflineMeMessage] = useState<OfflineMessage>({
    open: false,
    offlineMode,
    messsage: '',
  });
  ;

  /**
   * Muestra un mensaje de advertencia al usuario antes de cambiar el modo offline/online.
   */
  const handleOfflineChange = (checked: boolean) => {
    const message1 =
      'Al activar el modo offline la funcionalidad puede estar limitada y los datos que se mostrarán pueden no ser los más actuales.';
    const message2 =
      'Al activar el modo online se trabajará con la información más actual de la nube.';

    setOfflineMeMessage({
      open: true,
      offlineMode: checked,
      messsage: checked ? message1 : message2,
    });
  };

  // Actualiza `offlineLoggin` cuando cambia el contexto
  useEffect(() => {
    setOfflineLoggin(offlineMode);
  }, [offlineMode]);

  /**
   * Confirma el cambio de estado offline.
   */
  const handleOkMessageOffline = () => {
    handleOfflineMode(offlineMeMessage.offlineMode);
    setOfflineMeMessage({ open: false, offlineMode: false, messsage: '' });
  };

  /**
   * Cancela el cambio de estado offline.
   */
  const handleCancelMessageOffline = () => {
    handleOfflineMode(!offlineMeMessage.offlineMode);
    setOfflineMeMessage({ open: false, offlineMode: false, messsage: '' });
  };

  // Muestra una alerta si hay una notificación de Firebase
  useEffect(() => {
    if (firebaseMessaging?.notification) {
      showAlert({
        title: firebaseMessaging.notification.notification?.title ?? 'Notificación',
        description: firebaseMessaging.notification.notification?.body ?? '',
        type: 'notification',
        showSecondaryButton: false,
        primaryLabel: 'Cerrar',
        onPrimaryClick: firebaseMessaging.closeNotificacion,
        onClose: firebaseMessaging.closeNotificacion
      });
    }
  }, [firebaseMessaging, showAlert]);


  return {
    alert,
    hideAlert,
    theme,
    toggleTheme,
    pathname,
    tabs,
    userFullName: user?.fullName,
    logout,
    validPermissionsbyroute,
    offlineLoggin,
    offlineMeMessage,
    handleOfflineChange,
    handleOkMessageOffline,
    handleCancelMessageOffline,
    handleAlertClose,
    sidebarRoutes,
    usePrincipalImage
  };
};

export default useMainPage;
