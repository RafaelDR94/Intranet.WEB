import { TabItem } from "../types";

/**
 * Props for the useMainTab hook.
 * - `tabs`: available tabs (path can include `?id` to indicate a detail tab).
 * - `pathname`: current pathname to resolve active base.
 * - `validPermissionsbyroute`: predicate to allow/deny tabs (ignores query).
 */
export type useMainTabsProps = {
  tabs: TabItem[];
  pathname: string;
  validPermissionsbyroute: (path: string) => boolean;
};
