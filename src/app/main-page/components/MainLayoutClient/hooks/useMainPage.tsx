import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { usePrincipal } from '../../../../context/PrincipalContext/PrincipalContext';
import { useAuth } from '../../../../context/AuthContext/AuthContext';
import { useFirebase } from '../../../../context/FirebaseContext/FirebaseContext';
import { getTabsFromPath } from '../../../utilities/getTabsFromPath';
import HomeIcon from '@/assets/icons/navegacion/home.svg';
import FileIcon from '@/assets/icons/Docs/archive.svg';

/**
 * Rutas visibles en el sidebar principal de la página /main-page.
 */
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

/**
 * Estado del mensaje modal de confirmación para activar/desactivar el modo offline.
 */
export interface OfflineMessage {
  open: boolean;
  offlineMode: boolean;
  messsage: string;
}

/**
 * Hook principal para manejar lógica y estado de la página `MainPage`.
 * Incluye control de tema, alertas, notificaciones, tabs, logout, permisos y modo offline.
 *
 * @returns {object} props y funciones listas para usar en el layout y sidebar principal.
 */
export const useMainPage = () => {
  // Hooks de contexto global
  const { usePrincipalTheme, usePrincipalAlert } = usePrincipal();
  const { alert, hideAlert, showAlert } = usePrincipalAlert;
  const { theme, toggleTheme } = usePrincipalTheme;
  const pathname = usePathname();
  const tabs = getTabsFromPath(pathname);

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
    sidebarRoutes,
  };
};

export default useMainPage;
