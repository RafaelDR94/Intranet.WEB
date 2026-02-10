// app/layouts/components/MainTabs/types.ts
import type { PendingNotification } from '../../hooks/types';

export type TabItem = {
  path: string;
  label: string;
};

export type MainTabsProps = {
  tabs: TabItem[];
  pathname: string;
  validPermissionsbyroute: (path: string) => boolean;
  /** Show highlighted bell when there is a new notification. */
  hasNotification?: boolean;
  pendingNotifications?: PendingNotification[];
  onOpenPending?: (notification: PendingNotification) => void;
  onDismissPending?: (notificationId: string) => void;

  // NEW: callback para abrir el menu movil desde la hamburguesa
  onOpenMobileMenu?: () => void;
};
