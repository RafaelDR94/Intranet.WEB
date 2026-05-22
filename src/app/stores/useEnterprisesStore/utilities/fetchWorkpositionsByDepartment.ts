import type { Get, Set } from "../types";

import { WorkPositionsByDepartment } from "@/app/configurations/Axios/urls";
import { mapWorkPositions } from "@/app/mappings/workposition/workposition.mapper";
import type { WorkPositionType } from "@/app/mappings/workposition/workposition.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

const buildUrl = (departmentId: string) =>
  `${WorkPositionsByDepartment}/${encodeURIComponent(departmentId)}`;

export const fetchWorkpositionsByDepartment = async (
  departmentId: string,
  set: Set,
  get: Get,
  force = false
): Promise<WorkPositionType[]> => {
  const normalizedDepartmentId = String(departmentId ?? "").trim();
  if (!normalizedDepartmentId) {
    set({
      workpositions: [],
      currentDepartmentId: undefined,
      successGetWorkpositions: true,
      error: undefined,
    });
    return [];
  }

  const cached = get().workpositionsByDepartment[normalizedDepartmentId];
  if (cached && cached.length > 0 && !force) {
    set({
      workpositions: cached,
      currentDepartmentId: normalizedDepartmentId,
      successGetWorkpositions: true,
      error: undefined,
    });
    return cached;
  }

  set({
    loadingWorkpositions: true,
    successGetWorkpositions: false,
    error: undefined,
    currentDepartmentId: normalizedDepartmentId,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(buildUrl(normalizedDepartmentId));
    const mapped: WorkPositionType[] = mapWorkPositions(
      res.data?.data ?? res.data ?? []
    );

    const state = get();
    set({
      loadingWorkpositions: false,
      successGetWorkpositions: true,
      workpositions: mapped,
      workpositionsByDepartment: {
        ...state.workpositionsByDepartment,
        [normalizedDepartmentId]: mapped,
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
