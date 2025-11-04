// src/app/stores/useEnterprisesStore/utilities/fetchWorkpositions.ts
import type { Set, Get } from "../types";

import { WorkPosition } from "@/app/configurations/Axios/urls";
import { mapWorkPositions } from "@/app/mappings/workposition/workposition.mapper";
import type { WorkPositionType } from "@/app/mappings/workposition/workposition.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

const ALL_KEY = "__all__";

const buildUrl = (enterpriseId?: string) => {
  if (!enterpriseId) return WorkPosition;
  const separator = WorkPosition.includes("?") ? "&" : "?";
  return `${WorkPosition}${separator}enterpriseId=${encodeURIComponent(
    enterpriseId
  )}`;
};

/**
 * Obtiene los puestos de trabajo asociados a una empresa.
 */
export const fetchWorkpositions = async (
  enterpriseId: string | undefined,
  set: Set,
  get: Get,
  force = false
): Promise<WorkPositionType[]> => {
  const cacheKey = enterpriseId ?? ALL_KEY;
  const cached = get().workpositionsByEnterprise[cacheKey];
  if (cached && cached.length > 0 && !force) {
    set({
      workpositions: cached,
      currentEnterpriseId: enterpriseId,
      successGetWorkpositions: true,
      error: undefined,
    });
    return cached;
  }

  set({
    loadingWorkpositions: true,
    successGetWorkpositions: false,
    error: undefined,
    currentEnterpriseId: enterpriseId,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(buildUrl(enterpriseId));
    const mapped: WorkPositionType[] = mapWorkPositions(
      res.data?.data ?? res.data ?? []
    );

    const state = get();
    set({
      loadingWorkpositions: false,
      successGetWorkpositions: true,
      workpositions: mapped,
      workpositionsByEnterprise: {
        ...state.workpositionsByEnterprise,
        [cacheKey]: mapped,
      },
    });

    return mapped;
  } catch (err) {
    const normalized = normalizeApiError(err);
    set({
      loadingWorkpositions: false,
      successGetWorkpositions: false,
      error: normalized.message,
    });
    return [];
  }
};
