// app/layouts/components/MainTabs/types.ts
export type TabItem = {
  path: string;
  label: string;
};

export type MainTabsProps = {
  tabs: TabItem[];
  pathname: string;
  validPermissionsbyroute: (path: string) => boolean;

  // NEW: callback para abrir el menú móvil desde la hamburguesa
  onOpenMobileMenu?: () => void;
};
