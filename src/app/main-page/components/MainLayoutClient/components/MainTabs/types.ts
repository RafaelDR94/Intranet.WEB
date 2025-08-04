export interface MainTab {
  label: string;
  path: string;
}

export interface MainTabsProps {
  tabs: MainTab[];
  pathname: string;
  validPermissionsbyroute: (path: string) => boolean;
}
