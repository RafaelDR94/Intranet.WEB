import { useSearchParams } from "next/navigation";

import { getQS, basePath } from "../utilities/mainTabs";

import { useMainTabsProps } from "./types";

import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";

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
  const normalizeParam = (value: string | null) => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  };
  const currentId =
    normalizeParam(searchParams.get("id")) ??
    normalizeParam(searchParams.get("authorization_id"));
  const currentEmployeeId = normalizeParam(searchParams.get("idEmployee"));

  const isActive = (tabPath: string) => {
    const tabBase = basePath(tabPath);
    if (tabBase !== currentBase) return false;

    const tabQS = getQS(tabPath);
    const tabHasId = tabQS.has("id");
    const tabHasEmployeeId = tabQS.has("idEmployee");

    if (tabHasId || tabHasEmployeeId) {
      const expectedId = normalizeParam(tabQS.get("id"));
      const expectedEmployeeId = normalizeParam(tabQS.get("idEmployee"));

      if (expectedId || expectedEmployeeId) {
        return Boolean(
          (expectedId &&
            (expectedId === currentId || expectedId === currentEmployeeId)) ||
            (expectedEmployeeId &&
              (expectedEmployeeId === currentEmployeeId ||
                expectedEmployeeId === currentId))
        );
      }

      return Boolean(currentId || currentEmployeeId);
    }

    return !currentId && !currentEmployeeId;
  };

  // Filter using base path only so query params don't affect permissions.
  const filtered = tabs.filter((tab) => validPermissionsbyroute(basePath(tab.path)));
  return { isMobile, filtered, isActive };
};

export default useMainTab;

