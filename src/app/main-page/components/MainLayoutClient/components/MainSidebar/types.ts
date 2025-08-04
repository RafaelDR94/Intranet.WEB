export interface SidebarRoute {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  subroutes?: { label: string; path: string }[];
}

export interface MainSidebarProps {
  offlineMode: boolean;
  onToggleOffline: (value: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userFullName?: string;
  logout: () => Promise<void> | void;
  validPermissionsbyroute: (path: string) => boolean;
  routes: SidebarRoute[];
}
