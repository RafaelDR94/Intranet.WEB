import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';

import { useAuth } from '../../../../context/AuthContext/AuthContext';
import { useFirebase } from '../../../../context/FirebaseContext/FirebaseContext';
import { usePrincipal } from '../../../../context/PrincipalContext/PrincipalContext';
import { getTabsFromPath } from '../utilities/getTabsFromPath';
import { OfflineMessage, PendingNotification } from './types';

import ServerIcon from '@/assets/icons/Connectivity/server.svg';
import FileIcon from '@/assets/icons/Docs/archive.svg';
import HomeIcon from '@/assets/icons/navegacion/home.svg';
/**
 * Rutas visibles en el sidebar principal de la pagina /main-page.
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
    label: 'Operaciones',
    path: '/main-page/operations',
    icon: ServerIcon,
    subroutes: [
      { label: 'Requisiciones', path: '/main-page/operations/requisitions' },
    ],
  },
  {
    label: 'Portal de Servicios',
    path: '/main-page/request',
    icon: FileIcon,
    subroutes: [
      { label: 'Caja Chica', path: '/main-page/request/pettycash' },
      { label: 'Documentos', path: '/main-page/request/documents' },
      { label: 'Accesos', path: '/main-page/request/acces' },
      { label: 'Requisiciones', path: '/main-page/request/ownrequisitions' },
      { label: 'Prestamo Vehicular', path: '/main-page/request/vehicleassignament' }
    ],
  },
  {
    label: 'Contabilidad',
    path: '/main-page/accounting',
    icon: ServerIcon,
    subroutes: [
      { label: 'Facturacion', path: '/main-page/accounting/invoices' },
      { label: 'Requisiciones', path: '/main-page/accounting/requisitions' },
      { label: 'SAP', path: '/main-page/accounting/sap' },
    ],
  },
  {
    label: 'Proyectos',
    path: '/main-page/proyects',
    icon: ServerIcon,
    subroutes: [
      { label: 'Proyectos', path: '/main-page/proyects/proyects' },
      { label: 'Inventario', path: '/main-page/proyects/inventory' },
    ],
  },
  {
    label: 'IT',
    path: '/main-page/it',
    icon: ServerIcon,
    subroutes: [
      { label: 'Dispositivos', path: '/main-page/it/internaldevices' },
      { label: 'Usuarios', path: '/main-page/it/users' },
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
    label: 'RRHH',
    path: '/main-page/humanresources',
    icon: ServerIcon,
    subroutes: [
      { label: 'Comunicados', path: '/main-page/humanresources/release' },
      { label: 'Documentos', path: '/main-page/humanresources/documents' },
      { label: 'Organigrama', path: '/main-page/humanresources/organizationchart' },
      { label: 'Empresas', path: '/main-page/humanresources/companies' },
      { label: 'Departamentos', path: '/main-page/humanresources/departments' },
    ],
  },
  {
    label: 'Organigrama',
    path: '/main-page/organigrama',
    icon: ServerIcon,
    subroutes: [
      { label: 'Departamentos', path: '/main-page/organigrama/departments' },
      { label: 'Directorio General', path: '/main-page/organigrama/generaldirectory' },
    ],
  },
  {
    label: 'Administracion',
    path: '/main-page/usersmanagment',
    icon: ServerIcon,
    subroutes: [
      { label: 'Administracion de usuarios', path: '/main-page/administration/usersmanagment' },
    ],
  },
    {
    label: 'Autorizaciones',
    path: '/main-page/authorizations',
    icon: ServerIcon,
    subroutes: [
      { label: 'Lista de autorizaciones', path: '/main-page/authorizations/authorizationslist' },
    ],
  },
];

/**
 * Estado del mensaje modal de confirmacion para activar/desactivar el modo offline.
 */


/**
 * Hook principal para manejar logica y estado de la pagina `MainPage`.
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
  const router = useRouter();

  const handleAlertClose = useCallback(() => {
    alert?.onClose?.();
    hideAlert();
  }, [alert, hideAlert]);

  const navigateToEventUrl = useCallback(
    (eventUrl?: string) => {
      if (!eventUrl) return;
      if (eventUrl.startsWith('http')) {
        try {
          const url = new URL(eventUrl);
          if (url.origin === window.location.origin) {
            const relative = `${url.pathname}${url.search}${url.hash}`;
            router.push(relative);
          }
        } catch {
          // ignore invalid URLs
        }
        return;
      }
      router.push(eventUrl);
    },
    [router]
  );

  const tabs = useMemo(
    () => getTabsFromPath(pathname, searchParams),
    [pathname, searchParams]
  );

  const { user, offlineMode, handleOfflineMode, logout, validPermissionsbyroute } = useAuth();
  const { firebaseMessaging, firebaserealtime } = useFirebase();

  const [offlineLoggin, setOfflineLoggin] = useState(offlineMode);
  const [pendingNotifications, setPendingNotifications] = useState<PendingNotification[]>([]);

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
      'Al activar el modo offline la funcionalidad puede estar limitada y los datos que se mostraran pueden no ser los mas actuales.';
    const message2 =
      'Al activar el modo online se trabajara con la Información mas actual de la nube.';

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

  const handleRemovePending = useCallback(
    async (notificationId: string) => {
      if (!user?.idUser || !firebaserealtime) return;
      try {
        await firebaserealtime.deleteData(
          `Notifications/${user.idUser}/Pending/${notificationId}`
        );
      } catch (err) {
        console.error('Error removing pending notification', err);
      }
    },
    [firebaserealtime, user?.idUser]
  );

  const handleOpenPending = useCallback(
    async (notification: PendingNotification) => {
      const eventUrl = notification.data?.event_url;
      await handleRemovePending(notification.id);
      navigateToEventUrl(eventUrl);
    },
    [handleRemovePending, navigateToEventUrl]
  );

  // Muestra una alerta si hay una notificacion de Firebase
  useEffect(() => {
    if (firebaseMessaging?.notification) {
      const eventUrl = firebaseMessaging.notification?.data?.event_url as
        | string
        | undefined;
      const imageUrl = firebaseMessaging.notification?.data?.image_url as
        | string
        | undefined;
      const payloadData = firebaseMessaging.notification?.data ?? {};
      const pendingId =
        (payloadData.notification_id as string | undefined) ??
        (payloadData.notificationId as string | undefined) ??
        (payloadData.pending_id as string | undefined) ??
        (payloadData.pendingId as string | undefined) ??
        pendingNotifications.find(
          (notification) =>
            notification.data?.event_url === eventUrl &&
            notification.title ===
              (firebaseMessaging.notification.notification?.title ?? 'Notificacion') &&
            notification.body ===
              (firebaseMessaging.notification.notification?.body ?? '')
        )?.id;

      showAlert({
        title: firebaseMessaging.notification.notification?.title ?? 'Notificacion',
        description: firebaseMessaging.notification.notification?.body ?? '',
        type: 'notification',
        showPrimaryButton: false,
        showSecondaryButton: false,
        primaryLabel: 'Ir a evento',
        createdAt: new Date().toISOString(),
        avatarSrc: imageUrl,
        onPrimaryClick: async () => {
          if (pendingId) {
            await handleRemovePending(pendingId);
          }
          handleAlertClose();
          navigateToEventUrl(eventUrl);
        },
        onClose: firebaseMessaging.closeNotificacion,
      });
    }
  }, [
    firebaseMessaging,
    showAlert,
    navigateToEventUrl,
    pendingNotifications,
    handleRemovePending,
    handleAlertClose,
  ]);

  useEffect(() => {
    if (!user?.idUser || !firebaserealtime) return;
    const path = `Notifications/${user.idUser}/Pending`;
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = firebaserealtime.subscribe(path, (data) => {
        if (!data) {
          setPendingNotifications([]);
          return;
        }
        const next = Object.entries(data as Record<string, any>).map(([id, value]) => ({
          id,
          title: value?.title ?? 'Notificacion',
          body: value?.body ?? '',
          data: value?.data ?? {},
          createdAt: value?.createdAt,
          avatarSrc: value?.data?.image_url,
        }));
        next.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
        setPendingNotifications(next);
      });
    } catch (err) {
      console.warn('Firebase realtime not ready for pending notifications', err);
      return;
    }
    return () => unsubscribe?.();
  }, [firebaserealtime, user?.idUser]);

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
    usePrincipalImage,
    pendingNotifications,
    handleOpenPending,
    handleRemovePending
  };
};

export default useMainPage;
