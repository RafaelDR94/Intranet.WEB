import { getQS, basePath } from "../utilities/mainTabs";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useSearchParams } from "next/navigation";
import { useMainTabsProps } from "./types";

/**
 * Computes state for MainTabs: filters tabs by permissions, detects mobile,
 * and decides which tab is active based on pathname and the `id` query param.
 *
 * Active logic:
 * - When the current URL has no `id`, the base path tab (without `?id=`) is active.
 * - When the current URL has an `id`, the tab whose path includes `?id` is active.
 *   - If that tab specifies an explicit `id` (e.g. `/route?id=123`), it must match.
 *   - If it only includes `?id` without value, any present `id` activates it.
 */
const useMainTab = ({ pathname, tabs, validPermissionsbyroute }: useMainTabsProps) => {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const currentBase = basePath(pathname);
  const currentId = searchParams.get("id");

  const isActive = (tabPath: string) => {
    const tabBase = basePath(tabPath);
    if (tabBase !== currentBase) return false;

    const tabQS = getQS(tabPath);
    const tabHasId = tabQS.has("id");

    if (tabHasId) {
      const expectedId = tabQS.get("id");
      return expectedId ? currentId === expectedId : Boolean(currentId);
    }
    return !currentId;
  };

  // Filter using base path only so query params don't affect permissions.
  const filtered = tabs.filter((tab) => validPermissionsbyroute(basePath(tab.path)));
  return { isMobile, filtered, isActive };
};

export default useMainTab;

