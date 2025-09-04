export type RouteItem = {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  subroutes?: Array<{ path: string; label: string }>;
};

export type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;

  // mismas props que el MainSidebar
  offlineMode: boolean;
  onToggleOffline: (v: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userFullName?: string | null;
  logout: () => Promise<void>;
  validPermissionsbyroute: (path: string) => boolean;
  routes: RouteItem[];
};